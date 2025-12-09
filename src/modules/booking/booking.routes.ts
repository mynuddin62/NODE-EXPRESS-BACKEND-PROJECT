import express, { Request, Response } from "express";
import { bookingControllers } from "./booking.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);
export const bookingRoutes = router;