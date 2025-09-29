import express from "express";
import {
  getAllWebhookLogsController,
  getWebhookLogByIdController,
  getWebhookLogsByTeamController
} from "../controllers/webhooklog.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import authorizeRole from "../middlewares/authorizerole.middleware.js";

const webhookLogRouter = express.Router();


// Get all webhook logs
webhookLogRouter.get("/", authenticate, authorizeRole('admin'), getAllWebhookLogsController);

// Get webhook log by ID
webhookLogRouter.get("/:id", authenticate, authorizeRole('admin'), getWebhookLogByIdController);

// Get webhook logs by team
webhookLogRouter.get("/team/:team_id", authenticate, authorizeRole('admin'), getWebhookLogsByTeamController);

export default webhookLogRouter;
