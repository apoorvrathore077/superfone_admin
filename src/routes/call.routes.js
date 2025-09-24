import express from "express";
import {
  getAllCallsController,
  getCallByIdController
} from "../controllers/call.controller.js";

const callRouter = express.Router();

callRouter.get("/calls", getAllCallsController)
callRouter.get("/calls/:id",getCallByIdController);

export default callRouter;
