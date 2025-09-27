import create, { deleteUser, findAllUsers, findUserById, createAdmin, listAllAdmins, getAdminById, updateAdmin, deleteAdmin } from "../models/user.model.js";
import pool from "../config/db.js";
import { error } from "console";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function fetchAllUserController(req, res) {
    try {
        const users = await findAllUsers();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function findUserByIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Please enter your id 🙂" });
        }
        const user = await findUserById(id);
        if (!user) return res.status(404).json({ message: "User not found😞" });
        return res.status(200).json({ message: "User fetched", user });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        if (!id) return res.status(400).json({ message: "Please enter your id." });

        // Fetch user first
        const { rows: existing } = await pool.query(
            "SELECT * FROM auths.users WHERE id = $1",
            [id]
        );
        if (!existing[0]) {
            return res.status(404).json({ message: "User not found 😞" });
        }
        let fields = [];
        let values = [];
        let index = 1;

        if (name) {
            fields.push(`name = $${index++}`);
            values.push(name);
        }
        if (email) {
            fields.push(`email = $${index++}`);
            values.push(email);
        }
        let updatedUser = existing[0];
        if (fields.length > 0) {
            const { rows } = await pool.query(
                `UPDATE auths.users SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
                [...values, id]
            );
            updatedUser = rows[0];
        }
        // update role in team_members table (if provided)
        if (role) {
            await pool.query(
                "UPDATE auths.team_members SET role = $1 WHERE user_id = $2",
                [role, id]
            );
        }

        return res.status(200).json({
            message: "User updated successfully ✅",
            user: { ...updatedUser, role: role || existing[0].role },
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
}

export async function deleteUserController(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID required" });
        }

        const user = await deleteUser(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User deleted successfully ✅",
            deletedUser: user
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: err.message });
    }
}

//create a new admin user
export const createAdminController = async (req, res) => {
    try {
        const { name, email, mobile, profile_pic, password, global_role, company_id } = req.body;
        if (!name || !email || !mobile || !password || !global_role || !company_id) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await createAdmin({ name, email, mobile, profile_pic, password: hashedPassword, global_role, company_id });
        return res.status(201).json({
            message: "Admin user created successfully",
            newAdmin,
            success: true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};

//List all admins
export async function listAllAdminsController(req, res) {
    try {
        const allAdmin = await listAllAdmins();

        return res.status(200).json({
            message: "List of all admin",
            allAdmin,
            success: true
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        })

    }
}

//Get admin by ID
export async function getAdminByIdController(req, res) {
    try {
        const { id } = req.params;
        //Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid or missing company ID" })
        }
        const user = await getAdminById(id);

        if (!user) {
            return res.status(404).json({ message: "Company not found" })
        }
        res.status(200).json({
            message: 'get company succes',
            user,
            success: true
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message,
            success: false
        })

    }
}

//Update admin
export async function updateAdminController(req, res) {
    try {
        const { id } = req.params;
        const fields = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid or missing user ID" });
        }
        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        const updatedUser = await updateAdmin(id, fields);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found or nothing to update" });
        }

        res.status(200).json({
            message: "User updated successfully ✅",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ message: error.message, success: false });
    }
}

//Delete admin
export async function deleteAdminController(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid or missing user ID" });
        }
        const deletedUser = await deleteAdmin(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User deleted successfully",
            deletedUser,
            success: true
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message,
            success: false

        });
    }
}
