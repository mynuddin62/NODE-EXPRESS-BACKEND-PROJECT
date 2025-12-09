import { Request, Response } from "express";
import { bookingServices } from "./booking.service";



const createBooking = async (req: Request, res: Response) => {
  try {  
    const result = await bookingServices.createBooking(req.body, req.user!);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: /*result.rows[0]*/ result,
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




export const bookingControllers = {
  createBooking
};