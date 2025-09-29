import e from "express";
import {
  getUserByName,
  createTeam,
  addTeamMember,
  getTeamById,
  getTeamMembers,
  getAllTeams,
  updateTeam,
  deleteTeam
} from "../models/team.model.js";

import pool from "../config/db.js";
// Create a new team and add owner as member
export async function createTeamController(req, res) {
  try {
    const { name: teamName, owner_name } = req.body;

    if (!teamName || !owner_name) {
      return res.status(400).json({ message: "Team name and owner_name are required" });
    }

    // Check if owner exists
    const user = await getUserByName(owner_name);
    if (!user) {
      return res.status(400).json({ message: "User with this name does not exist" });
    }

    // Create the team
    const team = await createTeam({ name: teamName, ownerId: user.id, companyId: user.company_id });

    // Add owner as a member
    await addTeamMember({ teamId: team.id, userId: user.id, role: 'owner' });

    res.status(201).json({
      message: "Team created",
      team
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Get team details with members
export async function getTeamController(req, res) {
  try {
    const { id } = req.params;

    const team = await getTeamById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const members = await getTeamMembers(id);

    res.json({
      team,
      members
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function fetchTeamsController(req, res) {
  try {
    const teams = await getAllTeams();
    if (!teams) return res.status(400).json({ message: "Team not found." });
    res.status(200).json({ message: "Teams fetched sucessfully", teams });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function updateTeamController(req, res) {
  try {
    const { id } = req.params; // team id
    const companyId = req.user.company_id; // from JWT
    const { name, members } = req.body; // optional fields

    if (!name && !members) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedTeam = await updateTeam({ id, company_id: companyId, name, members });

    if (!updatedTeam) {
      // Check if team exists at all
      const { rows: teamExists } = await pool.query(
        `SELECT * FROM auths.teams WHERE id = $1`,
        [id]
      );

      if (teamExists.length === 0) {
        return res.status(404).json({ message: "Team not found" });
      } else {
        return res.status(403).json({ message: "Team does not belong to your company" });
      }
    }

    res.status(200).json({ message: "Team updated successfully", team: updatedTeam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


export async function deleteTeamController(req, res) {
  try {
    const { id } = req.params;
    const companyId = req.user.company_id; // from JWT

    const deleted = await deleteTeam({ id, company_id: companyId });

    if (!deleted) {
      // Check if team exists at all
      const { rows: teamExists } = await pool.query(
        `SELECT * FROM auths.teams WHERE id = $1`,
        [id]
      );

      if (teamExists.length === 0) {
        return res.status(404).json({ message: "Team not found" });
      } else {
        return res.status(403).json({ message: "Team does not belong to your company" });
      }
    }

    res.status(200).json({ message: "Team deleted successfully", team: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}