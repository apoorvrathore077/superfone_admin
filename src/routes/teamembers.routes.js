import express from "express";
import { addTeamMemberController, getTeamMembersController,getAllTeamMembersController, deleteTeamMemberController } from "../controllers/teammember.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import authorizeRole from "../middlewares/authorizerole.middleware.js";


const teamMemberRouter = express.Router();

// Add a member to a team
teamMemberRouter.post("/add",authenticate,authorizeRole('admin'), addTeamMemberController);

// List members of a team
teamMemberRouter.get("/:team_id",authenticate,authorizeRole('admin'), getTeamMembersController);

teamMemberRouter.get("/",authenticate,authorizeRole('admin'), getAllTeamMembersController);
teamMemberRouter.delete("/delete/:team_id/:user_id",authenticate,authorizeRole('admin'),deleteTeamMemberController);
export default teamMemberRouter;
