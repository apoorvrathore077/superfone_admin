import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import router from "./routes/user.routes.js";
import callRouter from "./routes/call.routes.js";
import leadRoutes from "./routes/lead.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


app.use("/api/admin/auth",authRouter);
app.use("/api/admin/users",router);
app.use("/api/admin",callRouter);
app.use("/api/admin/leads",leadRoutes);

export default app;