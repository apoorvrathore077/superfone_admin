import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import router from "./routes/user.routes.js";
import callRouter from "./routes/call.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import companyRoutes from "./routes/company.routes.js";
import agentRoutes from "./routes/agent.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


app.use("/api/superadmin/auth",authRouter);
app.use("/api/superadmin/users",router);
app.use("/api/superadmin",callRouter);
app.use("/api/superadmin/leads",leadRoutes);
app.use("/api/superadmin/company",companyRoutes);
app.use("/api/superadmin/agent",agentRoutes);

export default app;