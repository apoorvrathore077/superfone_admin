import express from "express";
import { createTeamController, deleteTeamController, fetchTeamsController, getTeamController, updateTeamController } from "../controllers/team.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import authorizeRole from "../middlewares/authorizerole.middleware.js";

const teamRoute = express.Router();

// Create a new team
teamRoute.post("/create",authenticate,authorizeRole('admin'), createTeamController);

// Get all teams detail
teamRoute.get("/",authenticate,authorizeRole('admin'),fetchTeamsController);

// update team name
teamRoute.put("/update/:id",authenticate,authorizeRole('admin'),updateTeamController);

// delete team
teamRoute.delete("/delete/:id",authenticate,authorizeRole('admin'),deleteTeamController);

// Get team details along with members
teamRoute.get("/:id",authenticate,authorizeRole('admin'), getTeamController);

export default teamRoute;