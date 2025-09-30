import express from "express";
import { createCompanyController,getAllCompanyController, getCompanyByIdController, getCompanyByNameController } from "../controllers/company.controller.js";

const companyRoutes = express.Router();
companyRoutes.post("/create",createCompanyController);
companyRoutes.get("/allcompany",getAllCompanyController);
companyRoutes.get("/getcompany/:id",getCompanyByIdController);
companyRoutes.get("/getcompanyname/:name",getCompanyByNameController)

export default companyRoutes;