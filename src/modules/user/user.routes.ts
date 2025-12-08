import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

// app.use("/users", userRooutes)

// routes -> controller -> service


router.get("/", logger, auth("admin"), userControllers.getUser);

router.put("/:userId", auth("admin", "customer"),  userControllers.updateUser);

router.delete("/:userId", auth("admin"),  userControllers.deleteUser);

export const userRoutes = router;