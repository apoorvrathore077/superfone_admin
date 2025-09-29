import {
  getAllWebhookLogs,
  getWebhookLogById,
  getWebhookLogsByTeam
} from "../models/webhooklog.model.js";

import { getTeamById } from "../models/team.model.js";
// Get all webhook logs
export async function getAllWebhookLogsController(req, res) {
  try {
    const companyId = req.user.company_id;
    const logs = await getAllWebhookLogs(companyId);
    res.json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get webhook log by ID
export async function getWebhookLogByIdController(req, res) {
  try {
    const { id } = req.params;
    const companyId = req.user.company_id;

    const log = await getWebhookLogById(id);

    if (!log) {
      return res.status(404).json({ message: "Webhook log not found" });
    }

    if (log.company_id !== companyId) {
      return res.status(403).json({ message: "Webhook log does not belong to your company" });
    }

    res.status(200).json({ webhook_log: log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get webhook logs by team
export async function getWebhookLogsByTeamController(req, res) {
  try {
    const { team_id } = req.params;
    const companyId = req.user.company_id;

    // Step 1: Check team exists
    const team = await getTeamById(team_id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Step 2: Check company ownership
    if (team.company_id !== companyId) {
      return res.status(403).json({ message: "This team doesn't belong to your company" });
    }

    // Step 3: Fetch logs
    const logs = await getWebhookLogsByTeam(team_id, companyId);
    if (logs.length === 0) {
      return res.status(404).json({ message: "No webhook logs found for this team" });
    }

    res.status(200).json({ team_id, logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
