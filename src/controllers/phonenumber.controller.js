import {
  addPhoneNumber,
  getAllPhoneNumbers,
  deletePhoneNumber,
  getPhoneNumbersByTeam
} from "../models/phonenumber.model.js";
import pool from "../config/db.js";
// Add a phone number
export async function addPhoneNumberController(req, res) {
  try {
    const { team_id, provider, number, metadata } = req.body;

    if (!team_id || !number) {
      return res.status(400).json({ message: "Team ID and number required" });
    }

    // 1️⃣ Fetch team info
    const teamCheck = await pool.query(
      `SELECT id, company_id FROM auths.teams WHERE id = $1`,
      [team_id]
    );
    if (!teamCheck.rows.length) {
      return res.status(404).json({ message: "Team not found" });
    }

    const teamCompanyId = teamCheck.rows[0].company_id;

    // 2️⃣ Company-level authorization
    // Assume req.user.company_id comes from JWT payload
    if (req.user.company_id !== teamCompanyId) {
      return res.status(403).json({ message: "You cannot add numbers to another company" });
    }

    // 3️⃣ Add phone number
    const phoneNumber = await addPhoneNumber({
      teamId: team_id,
      provider,
      number,
      metadata,
      companyId: teamCompanyId
    });

    res.status(201).json({ message: "Phone number added", phone_number: phoneNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


// Get all phone numbers
export async function getAllPhoneNumbersController(req, res) {
  try {
    const companyId = req.user.company_id; // Assuming company_id is in the JWT payload
    const numbers = await getAllPhoneNumbers(companyId);
    res.json({ numbers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get phone numbers by team
export async function getPhoneNumbersByTeamController(req, res) {
  try {
    const { team_id } = req.params;
    const companyId = req.user.company_id;

    const numbers = await getPhoneNumbersByTeam({ teamId: team_id, company_id: companyId });

    res.json({ team_id, numbers }); // numbers can be empty array
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: error.message }); // forbidden if team not belong
  }
}

// Controller
export async function deletePhoneNumberController(req, res) {
  try {
    const { id } = req.params;
    const companyId = req.user.company_id;

    const deleted = await deletePhoneNumber({ id, company_id: companyId });

    if (!deleted) {
      // Check if the phone number exists at all
      const { rows } = await pool.query(
        `SELECT * FROM telephony.phone_numbers WHERE id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Phone number not found" });
      } else {
        return res.status(403).json({ message: "Phone number does not belong to your company" });
      }
    }

    res.status(200).json({ message: "Phone number deleted", phone_number: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
