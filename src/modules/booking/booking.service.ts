import { pool } from "../../config/db";
import CustomError from "../../error/customError";
import { vehicleServices } from "../vehicle/vehicle.service";



const createBooking = async (payload: Record<string, string>, user: any) => {
  const {customer_id,  vehicle_id, rent_start_date, rent_end_date} = payload;

  if(user.id! !== customer_id && user.role! === 'customer'){
    throw new CustomError("customer can not create others booking", 400, 'Invalid_customer_id');
  }
  

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
  

  // const result = await pool.query(
  //   `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
  //   [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  // );

  // result.rows[0].created_at = undefined;
  // result.rows[0].updated_at = undefined;
  // return result;
  return availableVehicle;
};

export const bookingServices = {
  createBooking,

};