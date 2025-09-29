import pool from "../config/db.js";

// Get all webhook logs for the company
export async function getAllWebhookLogs(companyId) {
  const { rows } = await pool.query(
    `SELECT wl.*, t.company_id
     FROM telephony.webhook_logs wl
     JOIN auths.teams t ON wl.team_id = t.id
     WHERE t.company_id = $1
     ORDER BY wl.received_at DESC`,
    [companyId]
  );
  return rows;
}

// Get webhook log by ID with company check
export async function getWebhookLogById(id) {
  const { rows } = await pool.query(
    `SELECT wl.*, t.company_id
     FROM telephony.webhook_logs wl
     LEFT JOIN auths.teams t ON wl.team_id = t.id
     WHERE wl.id = $1`,
    [id]
  );
  return rows[0]; // undefined if not found
}

// Get webhook logs by team with company check
export async function getWebhookLogsByTeam(teamId, companyId) {
  const { rows } = await pool.query(
    `SELECT wl.*, t.company_id
     FROM telephony.webhook_logs wl
     JOIN auths.teams t ON wl.team_id = t.id
     WHERE wl.team_id = $1 AND t.company_id = $2
     ORDER BY wl.received_at DESC`,
    [teamId, companyId]
  );
  return rows;
}
