import { deleteAgent, getAgent, getAgentById, listAgentsUnderAdmin, updateAgent } from "../models/agent.model.js";

//Get all agents
export async function getAgentController(req, res) {
    try {
        const agents = await getAgent();
        if (!agents) {
            return res.status(404).json({ message: "No agents found" });
        }
        res.status(200).json({
            message: 'List of all Agents',
            agents,
            success: true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
            success: false
        });


    }
}

//Get agent by ID
export async function getAgentByIdController(req, res) {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid or missing agent ID" });
        }

        const agent = await getAgentById(id);



        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        res.status(200).json({
            message: "Agent fetched successfully",
            agent,
            success: true
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

// List agents under admin
export async function listAgentsUnderAdminController(req, res) {
    try {
        const { adminId } = req.params
        if (!adminId || isNaN(adminId)) {
            return res.status(400).json({ message: "Invalid or missing admin ID" });
        }
        const agents = await listAgentsUnderAdmin(adminId);
        if (!agents) {
            return res.status(404).json({ message: "No agents found for this admin" });
        }
        return res.status(200).json({
            message: "List of agents under admin",
            agents,
            success: true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

//Update agent
export async function updateAgentController(req, res) {
    try {
        const { id } = req.params;
        const fields = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid or missing user ID" });
        }
        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        const updatedAgents = await updateAgent(id, fields);

        if (!updatedAgents) {
            return res.status(404).json({ message: "User not found or nothing to update" });
        }

        res.status(200).json({
            message: "User updated successfully",
            updatedAgents: updatedAgents,
            success: true
        });

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ message: error.message, success: false });
    }
}

//Delete agent
export async function deleteAgentController(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid or missing agent ID " });
        }
        const deletedAgent = await deleteAgent(id);
        if (!deletedAgent) {
            return res.status(404).json({
                message: "Agent not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Agent deleted successfully",
            deletedAgent,
            success: true
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
            success: false
        });

    }
}