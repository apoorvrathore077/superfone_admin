import { error } from "console";
import pool from "../config/db.js";

// Fetch all calls with optional filters
export async function findAllCalls({ from, to, teamId }) {
  try {
    let conditions = [];
    let values = [];
    let index = 1;

    if (from) {
      conditions.push(`c.started_at >= $${index++}`);
      values.push(from);
    }
    if (to) {
      conditions.push(`c.ended_at <= $${index++}`);
      values.push(to);
    }
    if (teamId) {
      conditions.push(`c.team_id = $${index++}`);
      values.push(teamId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `
      SELECT c.id,
             c.call_ssid,
             c.from_number,
             c.to_number,
             c.status,
             c.started_at,
             c.ended_at,
             c.duration,
             c.recording_url,
             t.name AS team_name
      FROM telephony.calls c
      JOIN auths.teams t ON c.team_id = t.id
      ${whereClause}
      ORDER BY c.started_at DESC
      `,
      values
    );

    return rows;
  } catch (err) {
    console.error("findAllCalls error:", err.message);
    throw err;
  }
}

// Fetch call by ID
export async function findCallById(id) {
  try {
    const { rows } = await pool.query(
      `
      SELECT c.id,
             c.call_ssid,
             c.from_number,
             c.to_number,
             c.status,
             c.started_at,
             c.ended_at,
             c.recording_url,
             c.duration,
             t.id AS team_id,
             t.name AS team_name
      FROM telephony.calls c
      JOIN auths.teams t ON c.team_id = t.id
      WHERE c.id = $1
      `,
      [id]
    );

    return rows[0]; // single call object or undefined
  } catch (err) {
    console.error("findCallById error:", err.message);
    throw err;
  }
}

export async function findCallByTeamId(team_id){
  try{
    const {rows} = await pool.query(
      `
      SELECT c.id,
      c.team_id,
      c.call_ssid,
      c.from_number,
      c.to_number,
      c.status,    
      c.started_at,
      c.ended_at,
      c.recording_url,
      c.duration,
      t.id AS team_id,
      t.name AS team_name
      FROM telephony.calls c JOIN auth.teams t ON c.team_id = t.id
      WHERE c.team_id = $1
      `,
      [team_id]
    );
    return rows;
  }catch(err){
    console.log("Error: ",err.message);  
  }
}