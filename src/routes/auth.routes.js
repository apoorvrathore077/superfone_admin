import express from "express";
import { login, logout } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";

const authRouter = express.Router();
authRouter.post("/login",login);
authRouter.post("/logout",authenticate,logout);


export default authRouter;