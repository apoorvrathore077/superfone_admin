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
export async function createTeam({ name, ownerId, companyId }) {
  const { rows } = await pool.query(
    `INSERT INTO auths.teams (name, owner_id,company_id)
     VALUES ($1, $2,$3)
     RETURNING *`,
    [name, ownerId, companyId]
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
    `SELECT * FROM auths.teams WHERE id = $1`,
    [id]
  );
  return rows[0];
}

// Get all team members
export async function getTeamMembers(teamId) {
  const { rows } = await pool.query(
    `SELECT tm.user_id, u.name, u.email, tm.role
     FROM auths.team_members tm
     JOIN auths.users u ON tm.user_id = u.id
     WHERE tm.team_id = $1`,
    [teamId]
  );
  return rows;
}

export async function getAllTeams() {
  const { rows } = await pool.query(
    `
   SELECT * FROM auths.teams RETURNING * 
    `,
  );
  return rows;
}
export async function updateTeam({ id, company_id, name, members }) {
  // Only update if team belongs to this company
  const { rows: teamRows } = await pool.query(
    `SELECT * FROM auths.teams WHERE id = $1 AND company_id = $2`,
    [id, company_id]
  );

  if (teamRows.length === 0) {
    return null; // team not found for this company
  }

  if (name) {
    await pool.query(
      `UPDATE auths.teams SET name = $1 WHERE id = $2`,
      [name, id]
    );
  }

  if (members && Array.isArray(members)) {
    // Remove existing members
    await pool.query(
      `DELETE FROM auths.team_members WHERE team_id = $1`,
      [id]
    );

    // Insert new members
    for (const member of members) {
      const { user_id, role } = member;
      await pool.query(
        `INSERT INTO auths.team_members (team_id, user_id, role) VALUES ($1, $2, $3)`,
        [id, user_id, role || null]
      );
    }
  }

  const { rows: updatedRows } = await pool.query(
    `SELECT * FROM auths.teams WHERE id = $1`,
    [id]
  );

  return updatedRows[0];
}


export async function deleteTeam({ id, company_id }) {
  // Delete only if the team belongs to this company
  const { rows } = await pool.query(
    `DELETE FROM auths.teams 
     WHERE id = $1 AND company_id = $2
     RETURNING *`,
    [id, company_id]
  );

  return rows[0]; // undefined if not found or belongs to another company
}