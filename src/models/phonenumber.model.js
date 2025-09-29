import pool from "../config/db.js";

// Add a phone number
export async function addPhoneNumber({ teamId, provider, number, metadata, companyId }) {
  const { rows } = await pool.query(
    `INSERT INTO telephony.phone_numbers (team_id, provider, number, metadata,company_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [teamId, provider || null, number, metadata || {}, companyId || null]
  );
  return rows[0];
}

// Get all phone numbers
export async function getAllPhoneNumbers(company_id) {
  const { rows } = await pool.query(
    `
    SELECT pn.*
    FROM telephony.phone_numbers pn
    JOIN auths.teams t ON pn.team_id = t.id
    WHERE t.company_id = $1
    ORDER BY pn.created_at DESC 
    `,
    [company_id]
  );
  return rows;
}


// Get phone numbers by team ID
export async function getPhoneNumbersByTeam({ teamId, company_id }) {
  // First, check if the team belongs to this company
  const { rows: teamRows } = await pool.query(
    `SELECT id FROM auths.teams WHERE id = $1 AND company_id = $2`,
    [teamId, company_id]
  );

  if (teamRows.length === 0) {
    // Team does not belong to this company
    throw new Error("Team does not belong to your company");
  }

  // Fetch phone numbers (can be empty)
  const { rows: numbers } = await pool.query(
    `SELECT * FROM telephony.phone_numbers
     WHERE team_id = $1
     ORDER BY created_at DESC`,
    [teamId]
  );

  return numbers; // can be []
}

// Service
export async function deletePhoneNumber({ id, company_id }) {
  const { rows } = await pool.query(
    `DELETE FROM telephony.phone_numbers pn
     USING auths.teams t
     WHERE pn.team_id = t.id
       AND pn.id = $1
       AND t.company_id = $2
     RETURNING pn.*`,
    [id, company_id]
  );

  return rows[0]; // undefined if not found or not in same company
}