import pool from "../config/db.js";

// Add a member to a team
export async function addTeamMember({ teamId, userId, role = 'member' }) {
  const { rows } = await pool.query(
    `INSERT INTO auths.team_members (team_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [teamId, userId, role]
  );

  return rows[0];
}


// Get all members of a team
export async function getTeamMembers(teamId) {
  const { rows } = await pool.query(
    `SELECT tm.user_id, tm.role, u.name, u.email, u.mobile
     FROM auths.team_members tm
     JOIN auths.users u ON tm.user_id = u.id
     WHERE tm.team_id = $1`,
    [teamId]
  );

  return rows; // returns empty array if no members
}

export async function getAllTeamMembers(companyId) {
  const { rows } = await pool.query(
    `SELECT 
        tm.team_id, 
        t.name AS team_name, 
        t.company_id,
        tm.user_id, 
        tm.role,
        u.name, 
        u.email, 
        u.mobile
     FROM auths.team_members tm
     JOIN auths.teams t ON tm.team_id = t.id
     JOIN auths.users u ON tm.user_id = u.id
     WHERE t.company_id = $1
     ORDER BY t.id, tm.role`,
    [companyId]
  );

  return rows; // empty array if no members
}



// Optional: get user by ID
export async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM auths.users WHERE id = $1`,
    [id]
  );
  return rows[0];
}

// Optional: get team by ID
export async function getTeamById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM auths.teams WHERE id = $1`,
    [id]
  );
  return rows[0];
}

export async function deleteTeamMember(teamId, userId) {
  const { rows } = await pool.query(
    `DELETE FROM auths.team_members 
     WHERE team_id = $1 AND user_id = $2
     RETURNING *`,
    [teamId, userId]
  );

  return rows[0];
}
