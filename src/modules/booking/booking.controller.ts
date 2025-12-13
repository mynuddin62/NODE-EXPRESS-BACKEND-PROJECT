import { Request, Response } from "express";
import { bookingServices } from "./booking.service";



const createBooking = async (req: Request, res: Response) => {
  try {  
    const result = await bookingServices.createBooking(req.body, req.user!);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0] /*result*/,
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


const getBooking = async (req: Request, res: Response) => {
  try {
    const result  = await bookingServices.getBookings(req.user);
    let data;
    let msg;
    if (!result) {
      data = []
      msg = "No bookings found"  
    }else{
      data = result
      msg = "Bookings retrieved successfully"
    }
  
    res.status(200).json({
        success: true,
        message: msg,
        data: data,
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


const updateBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.updateBookings(req.params.bookingId!, req.body, req.user);
      res.status(200).json({
        success: true,
        message: result.rows[0].message,
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

export const bookingControllers = {
  createBooking,
  getBooking,
  updateBooking,
};