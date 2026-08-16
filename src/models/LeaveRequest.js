import mongoose from "mongoose";
import { withIdJSON } from "./plugins.js";

const leaveRequestSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, ref: "Employee" },
  type: { type: String, enum: ["casual", "sick", "earned"], required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  days: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  reason: { type: String, default: "" },
  appliedOn: { type: String, required: true },
  approverId: { type: String, default: null },
  approverComment: { type: String, default: null },
});

withIdJSON(leaveRequestSchema);

export const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
