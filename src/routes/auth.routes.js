import express from "express";
import { login, logout } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import { superAdminLogin } from "../controllers/super_admin.controller.js";

const authRouter = express.Router();
// authRouter.post("/login",login);
authRouter.post("/logout",authenticate,logout);
authRouter.post("/login",superAdminLogin);


export default authRouter;