import bcrypt from "bcrypt";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { findUserByEmail} from "../models/user.model.js";




export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      // Return immediately after sending response
      return res.status(401).json({ message: "Bhosdike isme sirf admin login karega.😡🤬" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query(
      "INSERT INTO auths.access_tokens (user_id, token, expires_at, created_at, revoked) VALUES ($1,$2,$3,NOW(),false)",
      [user.id, token, expiresAt]
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profile_pic: user.profile_pic
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function logout(req,res) {
    try{
        // get token from header
        const authHeader = req.headers["authorization"];
        if(!authHeader) return res.status(401).json({message:"Token is required"});

        const token = authHeader.split(" ")[1];
        if(!token) return res.status(401).json({message:"Invalid token format"});

        await pool.query(
            "UPDATE auths.access_tokens SET revoked = TRUE WHERE token = $1",
            [token]
        );
        return res.status(201).json({message:"Logout Successful"});
    }catch(err){
        console.log(err.message);
        return res.status(500).json({error:err.message});
    }
}







