import { Request, Response } from "express";
import { userServices } from "./user.service";


const getUser = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getUser();
    

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
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

const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.updateUser(req.params.userId!, req.body, req?.user);
      res.status(200).json({
        success: true,
        message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.userId!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errors: "NOT FOUND"
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result.rows,
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

export const userControllers = {
  getUser,
  updateUser,
  deleteUser,
};