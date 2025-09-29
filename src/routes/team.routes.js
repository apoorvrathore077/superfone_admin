import express from "express";
import { createTeamController, getAllTeamController, getTeamController, getTeamsByAdminController } from "../controllers/team.controller.js";

const teamRoute = express.Router();

// Create a new team
teamRoute.post("/teams/create", createTeamController);

teamRoute.get("/all",getAllTeamController);
teamRoute.get("/admin/:adminid",getTeamsByAdminController);
teamRoute.get("/:id", getTeamController);

export default teamRoute;
