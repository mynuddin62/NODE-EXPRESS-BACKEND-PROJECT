import { pool } from "../../config/db";
import CustomError from "../../error/customError";
import { toDateOnly } from "../../utils/stringUtils";
import { userServices } from "../user/user.service";
import { vehicleServices } from "../vehicle/vehicle.service";




const createBooking = async (payload: Record<string, string>, user: any) => {
  const {customer_id,  vehicle_id, rent_start_date, rent_end_date} = payload;

  //checking start and end date
  if (!rent_start_date || typeof rent_start_date !== 'string') {
    throw new CustomError("rent_start_date is required", 400, 'Invalid_rent_start_date');
  }

  if (!rent_end_date || typeof rent_end_date !== 'string') {
    throw new CustomError("rent_end_date is required", 400, 'Invalid_rent_end_date');
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (isNaN(startDate.getTime())) {
    throw new CustomError("Invalid rent_start_date", 400, "Invalid_rent_start_date");
  }

  if (isNaN(endDate.getTime())) {
    throw new CustomError("Invalid rent_end_date", 400, "Invalid_rent_end_date");
  }

  if (endDate <= startDate) {
    throw new CustomError(
      "rent_end_date must be greater than rent_start_date",
      400,
      "end_date_must_be_greater"
    );
  }


  // checking vehicle id ...

   if(!vehicle_id) {
    throw new CustomError("vehicle_id is required", 400, 'Invalid_vehicle_id');
  }
  const availableVehicle = await vehicleServices.getSingleAvailableVehicle(vehicle_id);


  const diff = endDate.getTime() - startDate.getTime();
  const number_of_days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const total_price = number_of_days * availableVehicle.daily_rent_price;
  const status = 'active'
  
  
  //checking customer id ...
  if(!customer_id) {
    throw new CustomError("customer_id is required", 400, 'Invalid_customer_id');
  }
  
  if(user.id! !== customer_id && user.role! !== 'admin'){
    throw new CustomError("Access forbidden. Insufficient permissions.", 403, 'FORBIDDEN');
  }

  if(user.id !== customer_id) {
    const existingCustomer = await userServices.getSingleuser(customer_id);
    if (!existingCustomer.rowCount) {
      throw new CustomError("Customer not found", 404, "USER_NOT_FOUND");
    }
  }

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]
  );

  
  const updateVehicle = {
    vehicle_name: availableVehicle.vehicle_name,
    type: availableVehicle.type,
    registration_number: availableVehicle.registration_number,
    daily_rent_price: String(availableVehicle.daily_rent_price),
    availability_status: 'booked'
  }


   const vehicleUpdateResult =await vehicleServices.updateVehicle(String(availableVehicle.id), updateVehicle);
  //assumming that vehicle will update, because we won't implement transactional behaviour 

  const vehicleRes = {
    vehicle_name: availableVehicle.vehicle_name,
    daily_rent_price: availableVehicle.daily_rent_price
  }

  result.rows[0].created_at = undefined;
  result.rows[0].updated_at = undefined;
  result.rows[0].vehicle = vehicleRes
  result.rows[0].rent_start_date = rent_start_date
  result.rows[0].rent_end_date = rent_end_date

  return result;
};



const getBookings = async (user: any, bookingId: number = 0 ) => {
  
  const updateBookingAndVehicleSytemQuery = 
  `WITH updated_bookings AS (
    UPDATE bookings
    SET status = 'returned'
    WHERE rent_end_date < CURRENT_DATE
    RETURNING vehicle_id
  )
  UPDATE vehicles
    SET availability_status = 'available'
    WHERE id IN (SELECT DISTINCT vehicle_id FROM updated_bookings)
  `;

  const res = await pool.query(updateBookingAndVehicleSytemQuery);
  console.log(res);

  interface CustomerResponse {
    name: string;
    email: string;
  }

  interface VehicleResponse {
    vehicle_name: string;
    registration_number: string;
    type?: string;
    availability_status?: string;
  }

  interface BookingResponse {
    id: number;
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
    total_price: number;
    status: string;
    customer: CustomerResponse;
    vehicle: VehicleResponse;
  }


  const id = user.role! === 'admin' ? 0 : user.id!


  const result = await pool.query(`
    SELECT b.id, b.customer_id, b.vehicle_id,  
    b.rent_start_date, b.rent_end_date,
    b.total_price, b.status, 
    u.name, u.email, u.id as user_id, u.role,
    v.vehicle_name, v.registration_number,
    v.type, v.availability_status
    FROM bookings b 
    INNER JOIN users u on u.id = b.customer_id
    INNER JOIN vehicles v on v.id = b.vehicle_id 
    WHERE 
      CASE WHEN $1 = 0 THEN 1=1 ELSE u.id = $2 END
      AND CASE WHEN $3 = 0 THEN 1=1 ELSE b.id = $4 END
      ORDER BY b.id ASC`
      , 
      [id, id, bookingId, bookingId])

  if (!result.rows.length) {
    return null;
  }

  const resList: BookingResponse[] = result.rows.map(row => {

    const customerResponse: CustomerResponse = {
      name: row.name,
      email: row.email
    };

    const vehicleResponse: VehicleResponse = {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number
    };

    if (id) {
      vehicleResponse.type = row.type;
    }

    if (bookingId && id) {
      vehicleResponse.availability_status = row.availability_status;
    }

    const responseObj: BookingResponse = {
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: toDateOnly(row.rent_start_date),
      rent_end_date: toDateOnly(row.rent_end_date),
      total_price: row.total_price,
      status: row.status,
      customer: customerResponse,
      vehicle: vehicleResponse
    };

    return responseObj;
  });

return resList;


  
};



const updateBookings  = async (id: string, payload: Record<string, string>, user: any) => {
  
  const {status} = payload;

  if(!status) {
    throw new CustomError("status is required", 400, 'invalid_status');
  }

  if (!['cancelled', 'returned'].includes(status)) {
    throw new CustomError("status is out of scope", 400, 'invalid_status');
  }

  if(status !== 'cancelled' && user.role === 'customer') {
    throw new CustomError("status is out of scope", 400, 'invalid_status');
  }

  const message = (status === 'returned') ? 'Booking marked as returned. Vehicle is now available' 
        : 'Booking cancelled successfully'
  
  
  const existingBooking = await getBookings(user, Number(id));

  if (!existingBooking || existingBooking.length !== 1) {
      throw new CustomError("No bookings found", 404, "NOT_FOUND")
  }else {
    
    const startDate = new Date(existingBooking[0]!.rent_start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0)

    if (startDate <= today) {
      throw new CustomError("Rent start date is not before today",400, "INVALID_RENT_START_DATE");
    }

  }


  let vehicle_id = ''   
  if(existingBooking[0]) {
    existingBooking[0].status = status
    vehicle_id =  String(existingBooking[0]!.vehicle_id)
  }

  //now update the booking status ...

  const result = await pool.query(
  `UPDATE bookings 
   SET status = $1
   WHERE id = $2
   RETURNING *`,
  [
    status, 
    Number(id)]
);

  result.rows[0].created_at = undefined;
  result.rows[0].updated_at = undefined;

  const vehicle = await vehicleServices.getSingleVehicle(vehicle_id);

  const updateVehicle = {
    vehicle_name: vehicle.vehicle_name,
    type: vehicle.type,
    registration_number: vehicle.registration_number,
    daily_rent_price: String(vehicle.daily_rent_price),
    availability_status: 'available'
  }
  const vehicleUpdateResult =await vehicleServices.updateVehicle(vehicle_id, updateVehicle);

  const vehicleResponse  = {
      availability_status : updateVehicle.availability_status
  }

  if(user.role === 'admin') {
    result.rows[0].vehicle = vehicleResponse
  }

  result.rows[0].message = message
  result.rows[0].rent_start_date = toDateOnly(result.rows[0].rent_start_date)
  result.rows[0].rent_end_date = toDateOnly(result.rows[0].rent_end_date)
  
  return result;

};


export const bookingServices = {
  createBooking,
  getBookings,
  updateBookings,
};