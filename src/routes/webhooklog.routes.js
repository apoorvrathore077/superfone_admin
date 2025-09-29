import express from "express";
import {
  createWebhookLogController,
  getAllWebhookLogsController,
  getWebhookLogByIdController,
  getWebhookLogsByTeamController
} from "../controllers/webhooklog.controller.js";

const webhookLogRouter = express.Router();

// Create a webhook log
webhookLogRouter.post("/telephony/webhook/create", createWebhookLogController);

// Get all webhook logs
webhookLogRouter.get("/all", getAllWebhookLogsController);

// Get webhook log by ID
webhookLogRouter.get("/:id", getWebhookLogByIdController);

// Get webhook logs by team
webhookLogRouter.get("/telephony/webhook-logs/team/:team_id", getWebhookLogsByTeamController);

export default webhookLogRouter;
