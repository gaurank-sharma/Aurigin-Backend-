import { Router } from "express";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { Employee } from "../models/Employee.js";
import { daysBetweenInclusive, todayISO } from "../lib/helpers.js";
import { requireRole, requireSelf } from "../middleware/auth.js";

export const leaveRouter = Router();

leaveRouter.get("/", async (_req, res) => {
  const requests = await LeaveRequest.find().sort({ appliedOn: -1 });
  res.json(requests);
});

leaveRouter.post("/", requireSelf("employeeId"), async (req, res) => {
  const { employeeId, type, startDate, endDate, reason } = req.body;
  if (!employeeId || !type || !startDate || !endDate) {
    return res.status(400).json({ error: "employeeId, type, startDate, and endDate are required" });
  }
  const employee = await Employee.findById(employeeId);
  if (!employee) return res.status(404).json({ error: "Employee not found" });

  const request = await LeaveRequest.create({
    employeeId,
    type,
    startDate,
    endDate,
    days: daysBetweenInclusive(startDate, endDate),
    status: "Pending",
    reason: reason || "",
    appliedOn: todayISO(),
    approverId: employee.managerId ?? null,
  });

  res.status(201).json(request);
});

leaveRouter.patch("/:id", requireRole("admin", "hr", "manager"), async (req, res) => {
  const { status, comment } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "status must be Approved or Rejected" });
  }

  const request = await LeaveRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ error: "Leave request not found" });

  request.status = status;
  request.approverComment = comment ?? null;
  await request.save();

  if (status === "Approved") {
    await Employee.updateOne(
      { _id: request.employeeId },
      { $inc: { [`leaveBalances.${request.type}.used`]: request.days } },
    );
  }

  res.json(request);
});
