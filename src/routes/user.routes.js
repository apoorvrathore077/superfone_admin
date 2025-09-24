import express from "express";
import { deleteUserController, fetchAllUserController, findUserByIdController, updateUser } from "../controllers/user.controller.js";


const router = express.Router();
router.get("/",fetchAllUserController);
router.get("/:id",findUserByIdController);
router.put("/:id",updateUser);
router.delete("/:id",deleteUserController);

export default router;