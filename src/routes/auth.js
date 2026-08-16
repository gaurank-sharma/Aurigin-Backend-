import { Router } from "express";
import { Employee } from "../models/Employee.js";
import { comparePassword, hashPassword, signToken } from "../lib/auth.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const employee = await Employee.findOne({ email: email.toLowerCase().trim() });
  if (!employee) return res.status(401).json({ error: "Invalid email or password" });

  const valid = await comparePassword(password, employee.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid email or password" });

  const token = signToken(employee);
  res.json({ token, employee });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const employee = await Employee.findById(req.employeeId);
  if (!employee) return res.status(404).json({ error: "Employee not found" });
  res.json(employee);
});

authRouter.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "currentPassword and a newPassword of at least 8 characters are required" });
  }

  const employee = await Employee.findById(req.employeeId);
  if (!employee) return res.status(404).json({ error: "Employee not found" });

  const valid = await comparePassword(currentPassword, employee.passwordHash);
  if (!valid) return res.status(401).json({ error: "Current password is incorrect" });

  employee.passwordHash = await hashPassword(newPassword);
  employee.mustChangePassword = false;
  await employee.save();

  res.json({ ok: true });
});
