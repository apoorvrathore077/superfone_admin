import { submitKyc } from "../controllers/kyc.controller.js";
import  authenticate from "../middlewares/authenticate.middleware.js";
import  authorizeRole  from "../middlewares/authorizerole.middleware.js";
import {uploadDocuments} from "../middlewares/uploadDocuments.middleware.js";
import express from "express";

const kycRouter = express.Router();

kycRouter.post("/submit",authenticate,authorizeRole('admin'),uploadDocuments, submitKyc);

export default kycRouter;