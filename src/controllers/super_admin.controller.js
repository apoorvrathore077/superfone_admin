import e from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createSuperAdmin, findUserByEmail } from "../models/user.model.js";
import pool from "../config/db.js";

export async function superAdminLogin(req, res) {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({
                message: "Incorrect username",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password",
                success: false
            })
        };
        const tokenData = {
            userId: user.id
        };


        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await pool.query(
            "INSERT INTO auths.access_tokens (user_id, token, expires_at, created_at, revoked) VALUES ($1,$2,$3,NOW(),false)",
            [user.id, token, expiresAt]
        );


        return res.status(200).json({
            message: "Login succesfull",
            _id: user.id,
            token,
            email: user.email,
            fullName: user.name

        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

//create Superadmin
export async function createsuperAdminController(req, res) {
    try {
        const { name, email, password, global_role } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const superAdmin = await createSuperAdmin({ name, email, password: hashedPassword, global_role });
        return res.status(201).json({
            message: "SuperAdmin created successfully",
            superAdmin,
            password: hashedPassword
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}