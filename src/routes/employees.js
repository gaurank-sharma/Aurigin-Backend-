import { Router } from "express";
import { Employee } from "../models/Employee.js";
import { OnboardingTask } from "../models/OnboardingTask.js";
import { slugify, uniqueEmployeeId, uniqueEmail, todayISO } from "../lib/helpers.js";
import { emptyLeaveBalances, buildOnboardingTasks, DEPARTMENT_COLOR } from "../lib/constants.js";
import { hashPassword, generateTempPassword } from "../lib/auth.js";
import { requireRole } from "../middleware/auth.js";

export const employeesRouter = Router();

employeesRouter.get("/", async (_req, res) => {
  const employees = await Employee.find().sort({ createdAt: 1 });
  res.json(employees);
});

employeesRouter.post("/", requireRole("admin", "hr"), async (req, res) => {
  const { name, title, department, managerId, employmentType, location, dateOfJoining, role } = req.body;
  if (!name || !title || !department) {
    return res.status(400).json({ error: "name, title, and department are required" });
  }

  const id = await uniqueEmployeeId(slugify(name), Employee);
  const email = await uniqueEmail(name, Employee);
  const tempPassword = generateTempPassword();

  const employee = await Employee.create({
    _id: id,
    name,
    email,
    passwordHash: await hashPassword(tempPassword),
    mustChangePassword: true,
    role: role || "employee",
    title,
    department,
    managerId: managerId || null,
    location: location || "",
    employmentType: employmentType || "Full-time",
    status: "Onboarding",
    dateOfJoining: dateOfJoining || todayISO(),
    leaveBalances: emptyLeaveBalances(),
    color: DEPARTMENT_COLOR[department] ?? "#013fd2",
  });

  await OnboardingTask.insertMany(buildOnboardingTasks(id));

  // Only time the plaintext temp password exists — the caller (HR/admin)
  // is responsible for relaying it to the new hire out of band.
  res.status(201).json({ ...employee.toJSON(), tempPassword });
});

employeesRouter.patch("/:id/complete-onboarding", requireRole("admin", "hr"), async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, { status: "Active" }, { new: true });
  if (!employee) return res.status(404).json({ error: "Employee not found" });
  res.json(employee);
});
