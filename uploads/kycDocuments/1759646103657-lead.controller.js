import {
  createLead,
  getLeadById,
  getAllLeads,
  getLeadsByTeamId,
  updateLeadService,
  deleteLead
} from "../models/lead.model.js";
import pool from "../config/db.js";

// Create a new lead
export async function createLeadController(req, res) {
  try {
    const { team_id, phone, name, notes, assigned_to } = req.body;

    if (!phone || !team_id) {
      return res.status(400).json({ message: "team_id and phone are required" });
    }

    // 1. Check team belongs to same company
    const { rows: teamRows } = await pool.query(
      "SELECT id, company_id FROM auths.teams WHERE id = $1",
      [team_id]
    );
    const team = teamRows[0];
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.company_id !== req.user.company_id) {
      return res.status(403).json({ message: "You cannot create leads for another company's team" });
    }

    // 2. Check assigned_to user
    let userName = null;
    if (assigned_to) {
      const { rows: userRows } = await pool.query(
        "SELECT id, name, company_id FROM auths.users WHERE name = $1",
        [assigned_to]
      );
      userName = userRows[0];

      if (!userName) {
        return res.status(400).json({ message: "Assigned user not found" });
      }

      if (userName.company_id !== req.user.company_id) {
        return res.status(400).json({ message: "Assigned user does not belong to your company" });
      }
    }

    // 3. Create lead
    const lead = await createLead({
      teamId: team_id,
      phone,
      name,
      notes,
      company_id: req.user.company_id,
      assigned_to: userName ? userName.name : null
    });

    res.status(201).json({
      message: "Lead created ✅",
      lead
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
// Get a lead by ID
export async function getLeadByIdController(req, res) {
  try {
    const { id } = req.params;
    const lead = await getLeadById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// Get all leads
export async function getAllLeadsController(req, res) {
  try {
    const leads = await getAllLeads(req.user.company_id);
    res.json({ leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// Get leads by team ID
export async function getLeadsByTeamIdController(req, res) {
  try {
    const { team_id } = req.params;
    const companyId = req.user.company_id; // from JWT

    const leads = await getLeadsByTeamId(team_id, companyId);

    res.json({ team_id, leads });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: error.message });
  }
}

// Update lead by id
export async function updateLeadController(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const companyId = req.user.company_id; // from logged-in admin JWT

    const lead = await updateLeadService(id, companyId, updates);

    res.status(200).json({
      message: "Lead updated successfully ✅",
      lead
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

// delete lead by id (soft delete)

export async function deleteLeadController(req, res) {
  try{
    const { id } = req.params;
    const companyId = req.user.company_id; // from logged-in admin JWT

    // Soft delete by setting is_active to false
    const deletedLead = await deleteLead(id, companyId);
    res.status(200).json({
      message: "Lead deleted successfully ✅",
      lead: deletedLead
    });
  }catch(err){
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
}
