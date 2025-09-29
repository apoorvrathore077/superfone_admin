import express from "express";
import { addAgent, deleteUserController, fetchAllUserController, findUserByIdController, updateUser } from "../controllers/user.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import authorizeRole from "../middlewares/authorizerole.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";


const router = express.Router();
router.post("/add-agent",authenticate,authorizeRole('admin'),upload.single('profile_pic'),addAgent);
router.get("/",authenticate,authorizeRole('admin'),fetchAllUserController);
router.get("/:id",authenticate,authorizeRole('admin'),findUserByIdController);
router.put("/update/:id",authenticate,authorizeRole('admin'), upload.single('profile_pic'),updateUser);
router.delete("/delete/:id",authenticate,authorizeRole('admin'),deleteUserController);

export default router;