import pool from "../config/db.js";

// Get user by name
export async function getUserByName(name) {
  const { rows } = await pool.query(
    `SELECT * FROM auths.users WHERE name = $1`,
    [name]
  );
  return rows[0];
}

// Create a new team
export async function createTeam({ name, ownerId }) {
  const { rows } = await pool.query(
    `INSERT INTO auths.teams (name, owner_id)
     VALUES ($1, $2)
     RETURNING *`,
    [name, ownerId]
  );
  return rows[0];
}

// Add a user as a team member
export async function addTeamMember({ teamId, userId, role = 'manager' }) {
  const { rows } = await pool.query(
    `INSERT INTO auths.team_members (team_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [teamId, userId, role]
  );
  return rows[0];
}

// Get team by ID
export async function getTeamById(id) {
  const { rows } = await pool.query(
    `SELECT t.*, 
            (SELECT COUNT(*) FROM auths.team_members tm WHERE tm.team_id = t.id) AS member_count
     FROM auths.teams t
     WHERE t.id = $1`,
    [id]
  );
  return rows[0];
}


// Get all team members
export async function getAllTeam() {
  const { rows } = await pool.query(
    `SELECT t.*, 
            (SELECT COUNT(*) 
             FROM auths.team_members tm 
             WHERE tm.team_id = t.id) AS member_count
     FROM auths.teams t`
  );
  return rows;
}

//Get Team Under Admin(adminId)
export async function getTeamsByAdmin(adminId) {
  const { rows } = await pool.query(
    `SELECT t.id,
            t.name,
            t.owner_id,
            t.company_id,
            t.created_at,
            COUNT(tm.user_id) AS member_count
     FROM auths.teams t
     LEFT JOIN auths.team_members tm
       ON tm.team_id = t.id
     WHERE t.owner_id = $1
     GROUP BY t.id, t.name, t.owner_id, t.company_id, t.created_at
     ORDER BY t.created_at DESC`,
    [adminId]
  );

  // Return all teams, not just the first one
  return rows.map(team => ({
    ...team,
    member_count: Number(team.member_count)
  }));
}
