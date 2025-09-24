import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function authenticate(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({message:"No token provided."});
    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    }catch(err){
        res.status(401).json({error:"Invalid token",err});
    }

}