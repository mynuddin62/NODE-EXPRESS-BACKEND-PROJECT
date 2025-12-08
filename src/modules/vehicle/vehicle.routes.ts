import express, { Request, Response } from "express";
import { vehicleControllers } from "./vehicle.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin"), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getVehicles);
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);
router.put("/:vehicleId",  auth("admin"),  vehicleControllers.updateVehicle);
router.delete("/:vehicleId",  auth("admin"), vehicleControllers.deleteVehicle);
export const vehicleRoutes = router;