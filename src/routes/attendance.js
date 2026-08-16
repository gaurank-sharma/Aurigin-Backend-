import { Router } from "express";
import { AttendanceRecord } from "../models/AttendanceRecord.js";
import { todayISO, nowTime } from "../lib/helpers.js";
import { requireSelf } from "../middleware/auth.js";

export const attendanceRouter = Router();

attendanceRouter.get("/", async (_req, res) => {
  const records = await AttendanceRecord.find().sort({ date: -1 });
  res.json(records);
});

async function upsertToday(employeeId, status) {
  const date = todayISO();
  return AttendanceRecord.findOneAndUpdate(
    { employeeId, date },
    { $set: { status, checkIn: nowTime() }, $setOnInsert: { employeeId, date, checkOut: null, hours: 0 } },
    { new: true, upsert: true },
  );
}

attendanceRouter.post("/check-in", requireSelf("employeeId"), async (req, res) => {
  const { employeeId } = req.body;
  const record = await upsertToday(employeeId, "Present");
  res.json(record);
});

attendanceRouter.post("/wfh", requireSelf("employeeId"), async (req, res) => {
  const { employeeId } = req.body;
  const record = await upsertToday(employeeId, "WFH");
  res.json(record);
});

attendanceRouter.post("/check-out", requireSelf("employeeId"), async (req, res) => {
  const { employeeId } = req.body;
  const record = await AttendanceRecord.findOneAndUpdate(
    { employeeId, date: todayISO() },
    { checkOut: nowTime() },
    { new: true },
  );
  if (!record) return res.status(404).json({ error: "No attendance record for today" });
  res.json(record);
});
