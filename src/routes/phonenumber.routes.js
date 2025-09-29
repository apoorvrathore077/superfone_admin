import express from "express";
import {
  addPhoneNumberController,
  getAllPhoneNumbersController,
  getPhoneNumbersByTeamController,
  deletePhoneNumberController
} from "../controllers/phonenumber.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import authorizeRole from "../middlewares/authorizerole.middleware.js";

const phoneNumberRoute = express.Router();

// Add a phone number
phoneNumberRoute.post("/add",authenticate,authorizeRole('admin'), addPhoneNumberController);

// Get all phone numbers
phoneNumberRoute.get("/",authenticate,authorizeRole('admin'), getAllPhoneNumbersController);

// Get all phone numbers by team
phoneNumberRoute.get("/team/:team_id",authenticate,authorizeRole('admin'), getPhoneNumbersByTeamController);
phoneNumberRoute.delete("/delete/:id",authenticate,authorizeRole('admin'), deletePhoneNumberController);

export default phoneNumberRoute;
