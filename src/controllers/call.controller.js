import { error } from "console";
import { findAllCalls,findCallById } from "../models/call.model.js";

export async function getAllCallsController(req, res) {
  try {
    const { fromNumber, toNumber, teamId } = req.query;

    const calls = await findAllCalls({ fromNumber, toNumber, teamId });

    if (!calls || calls.length === 0) {
      return res.status(404).json({ message: "No calls found 😞" });
    }

    return res.status(200).json({
      message: "Calls fetched successfully ✅",
      calls,
    });
  } catch (err) {
    console.error("getAllCallsController error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

export async function getCallByFilter(req,res){
  try{
    const{from_number,to_number,team_id} = req.query;
    if(!from_number && !to_number && !team_id) return res.status(400).json({message:"Atleast one filter required(from_number,to_number,team_id)."});
    const call = await findAllCalls({from_number,to_number,team_id});
    if(!call) return res.status(404).json({message:"No Call Found."});
    return res.status(200).json({message:"Call Found",call});
  }catch(err){
    console.log("Error: ",err.message);
    res.status(500).json({error:err.message});
  }
}

export async function getCallByIdController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Call ID is required" });
    }

    const call = await findCallById(id);

    if (!call) {
      return res.status(404).json({ message: "Call not found 😞" });
    }

    return res.status(200).json({
      message: "Call fetched successfully ✅",
      call,
    });
  } catch (err) {
    console.error("getCallByIdController error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}