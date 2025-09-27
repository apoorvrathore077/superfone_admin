import express from "express";
import { createAdminController, deleteUserController, fetchAllUserController, findUserByIdController, getAdminByIdController, listAllAdminsController, updateAdminController, updateUser } from "../controllers/user.controller.js";
import { createsuperAdminController } from "../controllers/super_admin.controller.js";



const router = express.Router();
router.get("/admin",listAllAdminsController);

router.get("/",fetchAllUserController);
router.get("/:id",findUserByIdController);
router.get("/:id",getAdminByIdController);  
router.put("/:id",updateUser);
router.delete("/:id",deleteUserController);
router.post("/createadmin",createAdminController);
router.post("/createsuperadmin",createsuperAdminController);
router.patch("/:id",updateAdminController);
router.delete("/:id",deleteUserController);
export default router;
