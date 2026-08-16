import mongoose from "mongoose";
import { withIdJSON } from "./plugins.js";

const onboardingTaskSchema = new mongoose.Schema({
  newHireId: { type: String, required: true, ref: "Employee" },
  category: { type: String, required: true },
  title: { type: String, required: true },
  owner: { type: String, enum: ["self", "hr", "it", "manager"], required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Done"], default: "Pending" },
});

withIdJSON(onboardingTaskSchema);

export const OnboardingTask = mongoose.model("OnboardingTask", onboardingTaskSchema);
