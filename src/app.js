import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import router from "./routes/user.routes.js";
import callRouter from "./routes/call.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import teamRoute from "./routes/team.routes.js";
import teamMemberRouter from "./routes/teamembers.routes.js";
import phoneNumberRoute from "./routes/phonenumber.routes.js";
import webhookLogRouter from "./routes/webhooklog.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


app.use("/api/admin/auth",authRouter);
app.use("/api/admin/users",router);
app.use("/api/admin/calls",callRouter);
app.use("/api/admin/phones",phoneNumberRoute);
app.use("/api/admin/leads",leadRoutes);
app.use("/api/admin/teams",teamRoute);
app.use('/api/admin/team-members',teamMemberRouter);
app.use('/api/admin/webhook-logs', webhookLogRouter);



export default app;