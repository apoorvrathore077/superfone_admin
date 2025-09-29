import express from "express";
import {
  getAllCallsController,
  getCallByIdController,
  getCallByFilter
} from "../controllers/call.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import authorizeRole from "../middlewares/authorizerole.middleware.js";

const callRouter = express.Router();

callRouter.get("/", authenticate, authorizeRole('admin'), getAllCallsController)
callRouter.get("/filter", authenticate, authorizeRole('admin'), getCallByFilter)
callRouter.get("/:id", authenticate, authorizeRole('admin'), getCallByIdController);

export default callRouter;
