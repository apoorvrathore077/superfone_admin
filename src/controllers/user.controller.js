import create, { deleteUser, findAllUsers, findUserById } from "../models/user.model.js";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

export async function addAgent(req, res) {
  try {
    const { name, email, password, mobile, global_role } = req.body;
    const profile_pic = req.file ? req.file.filename : null;

    // 1. Validate required fields
    if (!name || !email || !password || !mobile || !global_role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (mobile.length < 10) {
      return res.status(400).json({ message: "Please enter a valid mobile number" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const company_id = req.user.company_id;

    // 3. Create user
    const user = await create({
      name,
      email,
      mobile,
      profile_pic: profile_pic || null,
      password: hashedPassword,
      global_role,
      company_id
    });

    // 4. Return created user
    res.status(201).json({ message: "Agent created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

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
    const { name, email, role } = req.body || {};
    const profile_pic = req.file ? req.file.filename : null; // <-- new profile pic

    if (!id) return res.status(400).json({ message: "Please enter user id." });

    // Fetch existing user
    const { rows: existing } = await pool.query(
      "SELECT * FROM auths.users WHERE id = $1",
      [id]
    );
    const user = existing[0];

    if (!user) return res.status(404).json({ message: "User not found 😞" });

    // Prevent updating admin or super admin
    if (user.global_role?.toLowerCase() === 'admin' || user.global_role?.toLowerCase() === 'super admin') {
      return res.status(403).json({ message: "Cannot update admin or super admin users." });
    }

    // Build dynamic update query
    const fields = [];
    const values = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    if (profile_pic) {
      fields.push(`profile_pic = $${index++}`);
      values.push(profile_pic);
    }

    let updatedUser = user;

    if (fields.length > 0) {
      const { rows } = await pool.query(
        `UPDATE auths.users SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
        [...values, id]
      );
      updatedUser = rows[0];
    }

    // Update role in team_members if provided
    if (role) {
      await pool.query(
        "UPDATE auths.team_members SET role = $1 WHERE user_id = $2",
        [role, id]
      );
    }

    return res.status(200).json({
      message: "User updated successfully ✅",
      user: { ...updatedUser, role: role || user.role },
    });

  } catch (err) {
    console.error(err.message);
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
