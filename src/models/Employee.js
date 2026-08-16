import mongoose from "mongoose";
import { withIdJSON } from "./plugins.js";

const leaveBalanceEntry = {
  quota: { type: Number, required: true },
  used: { type: Number, required: true, default: 0 },
};

const employeeSchema = new mongoose.Schema(
  {
    // Slug (e.g. "gaurank-sharma") used as the primary key, matching the
    // ids the rest of the app's data (managerId, employeeId FKs) already
    // reference — avoids a second id scheme just for this collection.
    _id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    mustChangePassword: { type: Boolean, default: true },
    role: { type: String, enum: ["admin", "hr", "manager", "employee"], default: "employee" },
    title: { type: String, required: true },
    department: { type: String, required: true },
    managerId: { type: String, default: null },
    location: { type: String, default: "" },
    employmentType: { type: String, default: "Full-time" },
    status: { type: String, enum: ["Active", "Onboarding"], default: "Active" },
    dateOfJoining: { type: String, required: true },
    phone: { type: String, default: "" },
    color: { type: String, default: "#013fd2" },
    leaveBalances: {
      casual: leaveBalanceEntry,
      sick: leaveBalanceEntry,
      earned: leaveBalanceEntry,
    },
  },
  { timestamps: true, _id: false },
);

withIdJSON(employeeSchema, ["passwordHash"]);

export const Employee = mongoose.model("Employee", employeeSchema);
