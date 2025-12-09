import { pool } from "../../config/db";
import CustomError from "../../error/customError";
import { VehicleResponse } from "./vehicleResponse";

const createVehicle = async (payload: Record<string, string>) => {
  const {vehicle_name,  type, registration_number, daily_rent_price, availability_status} = payload;

  if (!daily_rent_price) {
    throw new CustomError("daily_rent_price is not positive", 400, 'invalid_daily_rent_price');
  }

  const price = Number(daily_rent_price)

  if(Number.isNaN(price) || price <= 0){
    throw new CustomError("daily_rent_price is not positive", 400, 'invalid_daily_rent_price');
  }

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


const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id ASC`);

  return result.rows.map((v) => new VehicleResponse(v));
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

  if (!result.rowCount) {
    throw new CustomError("Vehicle not found", 404, "NOT_FOUND");
  }

  return new VehicleResponse(result.rows[0]);
};

const updateVehicle  = async (id: string, payload: Record<string, string>) => {
  
  const {vehicle_name,  type, registration_number, daily_rent_price, availability_status} = payload;
  
  const existingVehicle = await getSingleVehicle(id);
  
  if (vehicle_name && vehicle_name !== existingVehicle.vehicle_name) {
    existingVehicle.vehicle_name = vehicle_name
  }

  if(registration_number && existingVehicle.registration_number !== registration_number) {
    existingVehicle.registration_number = registration_number 
  }

  const price =  daily_rent_price && !Number.isNaN(Number(daily_rent_price)) ? Number(daily_rent_price) : undefined
  
  if(price && price <= 0 ) {
    throw new CustomError("daily_rent_price is not positive", 400, 'invalid_daily_rent_price');
  }
  
  if(price && existingVehicle.daily_rent_price !== price) {
    existingVehicle.daily_rent_price = price 
  }

  if(type && existingVehicle.type !== type) {
     if (!['car', 'bike', 'van', 'SUV'].includes(type)) {
      throw new CustomError("type is out of scope", 400, 'invalid_type');
    }
    existingVehicle.type = type 
  }
  

  if(availability_status && existingVehicle.availability_status !== availability_status) {
     if (!['available', 'booked'].includes(availability_status)) {
      throw new CustomError("availability_status is out of scope", 400, 'invalid_availability_status');
    }
    existingVehicle.availability_status = availability_status 
  }
  


  const result = await pool.query(
  `UPDATE vehicles 
   SET vehicle_name = $1,
       type = $2,
       registration_number = $3,
       daily_rent_price = $4,
       availability_status = $5
   WHERE id = $6
   RETURNING *`,
  [
    existingVehicle.vehicle_name, 
    existingVehicle.type, 
    existingVehicle.registration_number, 
    existingVehicle.daily_rent_price, 
    existingVehicle.availability_status, 
    existingVehicle.id]
);

  result.rows[0].created_at = undefined;
  result.rows[0].updated_at = undefined;
  return result;
};

const deleteVehicle = async (id: string) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  return result;
};


const getSingleAvailableVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'`, [id]);

  if (!result.rowCount) {
    throw new CustomError("Vehicle not found", 404, "NOT_FOUND");
  }

  return new VehicleResponse(result.rows[0]);
};



export const vehicleServices = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
  getSingleAvailableVehicle
};