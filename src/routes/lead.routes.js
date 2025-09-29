import express from "express";
import {
  createLeadController,
  getLeadByIdController,
  getAllLeadsController,
  getLeadsByTeamIdController,
  updateLeadController,
  deleteLeadController
} from "../controllers/lead.controller.js";

import authenticate from "../middlewares/authenticate.middleware.js";
import authorizeRole from "../middlewares/authorizerole.middleware.js";

const leadRoutes = express.Router();

// Create a lead
leadRoutes.post("/create",authenticate,authorizeRole('admin'), createLeadController);

// Get a lead by ID
leadRoutes.get("/:id",authenticate,authorizeRole('admin'), getLeadByIdController);

// Get all leads
leadRoutes.get("/",authenticate,authorizeRole('admin'), getAllLeadsController);

// Get all leads by team ID
leadRoutes.get("/team/:team_id",authenticate,authorizeRole('admin'), getLeadsByTeamIdController);

// update lead by id
leadRoutes.put("/update/:id",authenticate,authorizeRole('admin'), updateLeadController);
leadRoutes.delete("/delete/:id",authenticate,authorizeRole('admin'),deleteLeadController);

export default leadRoutes;
