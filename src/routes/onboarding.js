import { Router } from "express";
import { OnboardingTask } from "../models/OnboardingTask.js";
import { Employee } from "../models/Employee.js";
import { requireRole } from "../middleware/auth.js";

export const onboardingRouter = Router();

onboardingRouter.get("/", async (_req, res) => {
  const tasks = await OnboardingTask.find();
  res.json(tasks);
});

onboardingRouter.patch("/:id", async (req, res) => {
  const { status } = req.body;
  if (!["Pending", "In Progress", "Done"].includes(status)) {
    return res.status(400).json({ error: "invalid status" });
  }
  const task = await OnboardingTask.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!task) return res.status(404).json({ error: "Onboarding task not found" });
  res.json(task);
});

onboardingRouter.post("/:employeeId/complete", requireRole("admin", "hr"), async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.employeeId, { status: "Active" }, { new: true });
  if (!employee) return res.status(404).json({ error: "Employee not found" });
  res.json(employee);
});
