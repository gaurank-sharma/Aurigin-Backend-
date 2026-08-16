import mongoose from "mongoose";
import { withIdJSON } from "./plugins.js";

const wfhRequestSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, ref: "Employee" },
  date: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  reason: { type: String, default: "" },
  appliedOn: { type: String, required: true },
  approverId: { type: String, default: null },
  approverComment: { type: String, default: null },
});

withIdJSON(wfhRequestSchema);

export const WfhRequest = mongoose.model("WfhRequest", wfhRequestSchema);
