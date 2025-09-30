import {
  getUserByName,
  createTeam,
  addTeamMember,
  getTeamById,
  getAllTeam,
  
  getTeamsByAdmin
} from "../models/team.model.js";
import { getTeamMembers } from "../models/teammembers.model.js";

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
    const team = await createTeam({ name: teamName, ownerId: user.id });

    // Add owner as a member
    await addTeamMember({ teamId: team.id, userId: user.id, role: 'owner' });

    res.status(201).json({
      message: "Team created",
      team
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get team details By Id
export async function getTeamController(req, res) {
  try {
    const { id } = req.params;

    const team = await getTeamById(id);
    
    if (!team) return res.status(404).json({ message: "Team not found" });

    const members = await getTeamMembers(id);
    const memberCount = members.length;

    res.json({
      team
    });

  } catch (err) {
    res.status(500).json({ error:err.message });
  }
}

//Get All team details
export async function getAllTeamController(req,res){
  try {
    const teams = await getAllTeam();
    if(!teams)
    {
      return res.json({message:"No teams found"});
    }
    res.status(200).json({
      message:"List of all teams",
      teams,
      sucess:true
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message:error.message,
      sucess:false
    })
  }
}

// Get Team Under Admin
export async function getTeamsByAdminController(req,res){
  try {
     const {adminid} = req.params;
     if(!adminid || isNaN(adminid)){
      return res.status(400).json({message:"Invalid or missing admin ID"});
     }
     const team = await getTeamsByAdmin(adminid);
     
     if(!team){
      return res.status(404).json({message:"No team found for this admin"});
     }
     res.status(200).json({
      message:"Get team Under Admin Succesfully",
      team,
      success:true
     })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message:error.message,
      success:false
    })
  }
}
