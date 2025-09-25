import express from "express";
import {
  getAllCallsController,
  getCallByIdController,
  getCallByFilter
} from "../controllers/call.controller.js";

const callRouter = express.Router();

callRouter.get("/calls", getAllCallsController)
callRouter.get("/calls/filter",getCallByFilter)
callRouter.get("/calls/:id",getCallByIdController);

export default callRouter;
