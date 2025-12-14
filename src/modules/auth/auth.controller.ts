import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    err.statusCode ??= 500;
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors??err.message
    });
  }
};


const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signupUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    err.statusCode ??= 500;
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors??err.message
    });
  }
};

export const authController = {
  loginUser,
  signupUser
};