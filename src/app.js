import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { employeesRouter } from "./routes/employees.js";
import { leaveRouter } from "./routes/leave.js";
import { wfhRouter } from "./routes/wfh.js";
import { attendanceRouter } from "./routes/attendance.js";
import { onboardingRouter } from "./routes/onboarding.js";
import { kudosRouter } from "./routes/kudos.js";
import { announcementsRouter } from "./routes/announcements.js";
import { requireAuth } from "./middleware/auth.js";

export const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length > 0 ? allowedOrigins : true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter); // login is public; /me protects itself

// Everything below requires a valid token.
app.use("/api", requireAuth);

app.use("/api/employees", employeesRouter);
app.use("/api/leave-requests", leaveRouter);
app.use("/api/wfh-requests", wfhRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/onboarding-tasks", onboardingRouter);
app.use("/api/kudos", kudosRouter);
app.use("/api/announcements", announcementsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
