import { pool } from "../../config/db";
import CustomError from "../../error/customError";



const createBooking = async (payload: Record<string, unknown>) => {
  const {vehicle_name,  type, registration_number, daily_rent_price, availability_status} = payload;
  
  if (!vehicle_name || typeof vehicle_name !== 'string') {
    throw new CustomError("vehicle_name is required", 400, 'Invalid_vehicle_name');
  }

  if (!registration_number) {
    throw new CustomError("registration_number is required", 400, 'invalid_registration_number');
  }

  if (!type || typeof type !== 'string') {
    throw new CustomError("type is required", 400, 'invalid_type');
  }

  if (!['car', 'bike', 'van', 'SUV'].includes(type)) {
    throw new CustomError("type is out of scope", 400, 'invalid_type');
  }
  
  if (!daily_rent_price || typeof daily_rent_price !== 'number' || daily_rent_price > 0) {
    throw new CustomError("daily_rent_price is not positive", 400, 'invalid_daily_rent_price');
  }

   if (!availability_status || typeof availability_status !== 'string') {
    throw new CustomError("availability_status is required", 400, 'invalid_availability_status');
  }

  if (!['available', 'booked'].includes(availability_status)) {
    throw new CustomError("invalid_availability_status is out of scope", 400, 'invalid_availability_status');
  }

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  result.rows[0].created_at = undefined;
  result.rows[0].updated_at = undefined;
  return result;
};

export const bookingServices = {

};