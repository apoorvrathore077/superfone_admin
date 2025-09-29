import express from "express";
import { addTeamMemberController, deleteMemberController, getTeamMembersController } from "../controllers/teammember.controller.js";


const teamMemberRouter = express.Router();

// Add a member to a team
teamMemberRouter.post("/team-members", addTeamMemberController);

// List members of a team
teamMemberRouter.get("/:team_id", getTeamMembersController);
teamMemberRouter.delete("/:id",deleteMemberController)

export default teamMemberRouter;
