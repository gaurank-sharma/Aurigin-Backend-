import mongoose from "mongoose";
import { withIdJSON } from "./plugins.js";

const attendanceRecordSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, ref: "Employee" },
  date: { type: String, required: true },
  status: { type: String, enum: ["Present", "WFH", "Half Day", "Absent", "Leave"], required: true },
  checkIn: { type: String, default: null },
  checkOut: { type: String, default: null },
  hours: { type: Number, default: 0 },
});

attendanceRecordSchema.index({ employeeId: 1, date: 1 }, { unique: true });

withIdJSON(attendanceRecordSchema);

export const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);
