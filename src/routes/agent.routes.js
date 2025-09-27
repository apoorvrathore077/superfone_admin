import express from "express";
import { deleteAgentController, getAgentByIdController, getAgentController, listAgentsUnderAdminController, updateAgentController } from "../controllers/agent.controller.js";

const agentRoutes = express.Router();
agentRoutes.get("/getagent",getAgentController);
agentRoutes.get("/:id",getAgentByIdController);
agentRoutes.get("/admin/:adminId",listAgentsUnderAdminController);
agentRoutes.patch("/:id",updateAgentController);
agentRoutes.delete("/:id",deleteAgentController)

export default agentRoutes;