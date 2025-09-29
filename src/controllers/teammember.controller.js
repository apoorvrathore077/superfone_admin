import { addTeamMember, getTeamMembers, getUserById, getTeamById,getAllTeamMembers } from "../models/teammembers.model.js";
import pool from "../config/db.js";
// Add a member

export async function addTeamMemberController(req, res) {
  try {
    const { team_id, user_id, role } = req.body;
    const companyId = req.user.company_id; // from JWT

    if (!team_id || !user_id) {
      return res.status(400).json({ message: "Team ID and User ID are required" });
    }

    // Check if team exists and belongs to the company
    const team = await getTeamById(team_id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.company_id !== companyId) {
      return res.status(403).json({ message: "Team does not belong to your company" });
    }

    // Check if user exists and belongs to the same company
    const user = await getUserById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.company_id !== companyId) {
      return res.status(403).json({ message: "User does not belong to your company" });
    }

    // Add the member
    const member = await addTeamMember({ teamId: team_id, userId: user_id, role });

    const response = {
      team_id: team.id,
      team_name: team.name,
      company_id: team.company_id,
      user_id: user.id,
      role: member.role,
      name: user.name,
      email: user.email,
      mobile: user.mobile
    };

    res.status(201).json({ message: "Member added", member: response });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error:error.message || "Internal server error" } );
  }
}

// List all members
export async function getTeamMembersController(req, res) {
  try {
    const { team_id } = req.params;
    const companyId = req.user.company_id;

    // Get the team and ensure it belongs to the company
    const team = await getTeamById(team_id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.company_id !== companyId) {
      return res.status(403).json({ message: "Team does not belong to your company" });
    }

    // Get team members
    const members = await getTeamMembers(team_id);

    // Return team name(s) as array
    const teamNames = team.name;

    res.json({ team_id, team_name: teamNames, members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllTeamMembersController(req, res) {
  try {
    const companyId = req.user.company_id;

    const members = await getAllTeamMembers(companyId);

    if (!members || members.length === 0) {
      console.log(`No team members found for company_id: ${companyId}`);
      return res.status(200).json({
        message: "No team members found for your company",
        team_members: []
      });
    }

    console.log(`Fetched ${members.length} team members for company_id: ${companyId}`);
    res.status(200).json({
      message: "Team members fetched successfully",
      team_members: members
    });

  } catch (error) {
    console.error(`Error fetching team members for company_id: ${req.user.company_id}`, error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function deleteTeamMemberController(req, res) {
  try {
    const { team_id, user_id } = req.params; // Use both IDs
    const companyId = req.user.company_id;

    if (!team_id || !user_id) {
      return res.status(400).json({ message: "team_id and user_id are required" });
    }

    // Check if member exists
    const { rows: memberRows } = await pool.query(
      `SELECT tm.*, t.company_id 
       FROM auths.team_members tm
       JOIN auths.teams t ON tm.team_id = t.id
       WHERE tm.team_id = $1 AND tm.user_id = $2`,
      [team_id, user_id]
    );

    if (memberRows.length === 0) {
      return res.status(404).json({ message: "Team member not found" });
    }

    const member = memberRows[0];
    if (member.company_id !== companyId) {
      return res.status(403).json({ message: "Team member does not belong to your company" });
    }

    // Delete the member
    await deleteTeamMember(team_id, user_id);

    res.status(200).json({ message: "Team member removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


