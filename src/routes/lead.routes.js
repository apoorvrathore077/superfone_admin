import express from "express";
import {
  createLeadController,
  getLeadByIdController,
  getAllLeadsController,
  getLeadsByTeamIdController
} from "../controllers/lead.controller.js";

const leadRoutes = express.Router();

// Create a lead
leadRoutes.post("/create", createLeadController);

// Get a lead by ID
leadRoutes.get("/:id", getLeadByIdController);

// Get all leads
leadRoutes.get("/", getAllLeadsController);

// Get all leads by team ID
leadRoutes.get("/team/:team_id", getLeadsByTeamIdController);

export default leadRoutes;
