import { findAllCalls,findCallById } from "../models/call.model.js";

export async function getAllCallsController(req, res) {
  try {
    const { from, to, teamId } = req.query;

    const calls = await findAllCalls({ from, to, teamId });

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