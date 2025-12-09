import { pool } from "../../config/db";
import CustomError from "../../error/customError";
import { vehicleServices } from "../vehicle/vehicle.service";
import { VehicleResponse } from "../vehicle/vehicleResponse";
import { BookingResponse } from "./bookingResponse";



const createBooking = async (payload: Record<string, string>, user: any) => {
  const {customer_id,  vehicle_id, rent_start_date, rent_end_date} = payload;

  if(!customer_id) {
    throw new CustomError("customer_id is required", 400, 'Invalid_customer_id');
  }
  
  if(user.id! !== customer_id && user.role! !== 'admin'){
    throw new CustomError("Access forbidden. Insufficient permissions.", 403, 'FORBIDDEN');
  }

  // now check user.id !== customer_id 
  // -> then customer id must be a valid customer ...

  

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
  
  if(!vehicle_id) {
    throw new CustomError("vehicle_id is required", 400, 'Invalid_vehicle_id');
  }
  const availableVehicle = await vehicleServices.getSingleAvailableVehicle(vehicle_id);

  console.log(availableVehicle, 'hello');
  
  //check valid vehicleId....



  const diff = endDate.getTime() - startDate.getTime();
  const days = diff / 24 * 60 * 60 * 1000;
  const rounded_days = Math.floor(days);

  const total_price = rounded_days * availableVehicle.daily_rent_price;
  const status = 'active'

  // insert into bookings then update the status of the vehicle ...
  // finally we will return data with vehicle name and daily rent price ...

  // const result = await pool.query(
  //   `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
  //   [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  // );

  // result.rows[0].created_at = undefined;
  // result.rows[0].updated_at = undefined;
  // return result;
  return availableVehicle;
};

const getBookings = async (user: any) => {
  
  const id = user.role! === 'admin' ? 0 : user.id!
  
  const result = await pool.query(`
    SELECT b.id, b.customer_id, b.vehicle_id,  
    b.rent_start_date, b.rent_end_date,
    b.total_price, b.status, u.name, u.email,
    v.vehicle_name, v.registration_number,
    v.type
    FROM bookings b 
    INNER JOIN users u on u.id = b.customer_id
    INNER JOIN vehicles v on v.id = b.vehicle_id 
    WHERE 
      CASE WHEN $1 = 0 THEN 1=1 ELSE id = $2 
      ORDER BY id ASC`
      , 
      [id, id])
  // need to bind about vehicle info 

  
  return result.rows.map((v: any) => new BookingResponse(v));
};


export const bookingServices = {
  createBooking,
  getBookings,
};