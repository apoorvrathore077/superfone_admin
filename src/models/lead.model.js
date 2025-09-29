import pool from "../config/db.js";

// Create a new lead
export async function createLead({ teamId, phone, name, notes, assigned_to,company_id }) {
  
  if(assigned_to){
    const { rows: existingRows } = await pool.query(
      `SELECT company_id FROM auths.users WHERE name = $1`,
      [assigned_to]
    );
    const user = existingRows[0];
    if (!user) throw new Error("Assigned user not found");
    if(user.company_id !== company_id) throw new Error("Assigned user does not belong to your company");
  }

  const { rows } = await pool.query(
    `INSERT INTO crm.leads (team_id, phone, name, notes,assigned_to,company_id)
     VALUES ($1, $2, $3, $4, $5,$6)
     RETURNING *`,
    [teamId || null, phone, name || null, notes || null, assigned_to || null, company_id || null]
  );
  return rows[0];
}

// Get a lead by ID
export async function getLeadById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM crm.leads WHERE id = $1`,
    [id]
  );
  return rows[0];
}

// Get all leads
export async function getAllLeads(company_id) {
  const { rows } = await pool.query(
    `SELECT * FROM crm.leads WHERE company_id = $1 ORDER BY created_at DESC`,
    [company_id]
  );
  return rows;
}

// Get all leads for a specific team
export async function getLeadsByTeamId(teamId, companyId) {
  // First validate team belongs to same company
  const { rows: teamRows } = await pool.query(
    `SELECT * FROM auths.teams WHERE id = $1 AND company_id = $2`,
    [teamId, companyId]
  );

  if (teamRows.length === 0) {
    throw new Error("Team does not belong to your company ❌");
  }

  // If valid, fetch leads
  const { rows: leadRows } = await pool.query(
    `SELECT * FROM crm.leads WHERE team_id = $1 AND company_id = $2 ORDER BY created_at DESC`,
    [teamId, companyId]
  );

  return leadRows;
}

// update lead model 
export async function updateLeadService(leadId, companyId, updates) {
  // 1. Check lead belongs to same company
  const { rows: existingRows } = await pool.query(
    `SELECT * FROM crm.leads WHERE id = $1 AND company_id = $2`,
    [leadId, companyId]
  );
  if (existingRows.length === 0) {
    throw new Error("Lead not found in your company ❌");
  }

  const lead = existingRows[0];
  const fields = [];
  const values = [];
  let index = 1;

  // 2. Update team_id if provided
  if (updates.team_id) {
    const { rows: teamRows } = await pool.query(
      "SELECT * FROM auths.teams WHERE id = $1 AND company_id = $2",
      [updates.team_id, companyId]
    );
    if (teamRows.length === 0) {
      throw new Error("Team does not belong to your company ❌");
    }
    fields.push(`team_id = $${index++}`);
    values.push(updates.team_id);
  }

  // 3. Update assigned_to if provided
  if (updates.assigned_to) {
    const { rows: userRows } = await pool.query(
      "SELECT * FROM auths.users WHERE name = $1 AND company_id = $2",
      [updates.assigned_to, companyId]
    );
    if (userRows.length === 0) {
      throw new Error("Assigned user does not belong to your company ❌");
    }
    fields.push(`assigned_to = $${index++}`);
    values.push(updates.assigned_to);
  }

  // 4. Optional fields in crm.leads
  if (updates.name) {
    fields.push(`name = $${index++}`);
    values.push(updates.name);
  }
  if (updates.phone) {
    fields.push(`phone = $${index++}`);
    values.push(updates.phone);
  }
  if (updates.notes) {
    fields.push(`notes = $${index++}`);
    values.push(updates.notes);
  }

  if (fields.length === 0) {
    return lead; // nothing to update
  }

  // 5. Build query
  const query = `
    UPDATE crm.leads
    SET ${fields.join(", ")}
    WHERE id = $${index} AND company_id = $${index + 1}
    RETURNING *`;

  const { rows: updatedRows } = await pool.query(query, [...values, leadId, companyId]);
  return updatedRows[0];
}

export async function deleteLead(id,company_id){
  try{
    const { rows: existingRows } = await pool.query(
      `SELECT * FROM crm.leads WHERE id = $1 AND company_id = $2`,
      [id, company_id]
    );
    if (existingRows.length === 0) {
      throw new Error("Lead not found in your company ❌");
    }
    await pool.query(
      `DELETE FROM crm.leads WHERE id = $1 AND company_id = $2`,
      [id, company_id]
    );
    return {message:"Lead deleted successfully ✅"};

  }catch(err){
    throw new Error(err.message);
  }
}