import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";


const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    console.log(err);
    err.statusCode ??= 500;
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors??err.message
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleServices.getVehicles();
    console.log(vehicles);
    
    if(!vehicles.length) {
      res.status(200).json({
      success: true,
      message: "No vehicles found",
      data: vehicles,
    }); 
    }else {
      res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
    }
  } catch (err: any) {
    err.statusCode ??= 500;
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};


const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result  = await vehicleServices.getSingleVehicle(req.params.vehicleId as string);

    res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result,
      });
  } catch (err: any) {
    err.statusCode ??= 500;
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.updateVehicle(req.params.vehicleId!, req.body);
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
  } catch (err: any) {
    err.statusCode ??= 500;
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteVehicle(req.params.vehicleId!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
        errors: "NOT FOUND"
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err.message
    });
  }
};


export const vehicleControllers = {
  getVehicles,
  createVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
};