import { Router } from "express";
import { Kudos } from "../models/Kudos.js";
import { todayISO } from "../lib/helpers.js";
import { requireSelf } from "../middleware/auth.js";

export const kudosRouter = Router();

kudosRouter.get("/", async (_req, res) => {
  const kudos = await Kudos.find().sort({ date: -1 });
  res.json(kudos);
});

kudosRouter.post("/", requireSelf("fromId"), async (req, res) => {
  const { fromId, toIds, value, message } = req.body;
  if (!fromId || !Array.isArray(toIds) || toIds.length === 0 || !value || !message) {
    return res.status(400).json({ error: "fromId, toIds, value, and message are required" });
  }
  const kudos = await Kudos.create({ fromId, toIds, value, message, date: todayISO(), likedBy: [] });
  res.status(201).json(kudos);
});

kudosRouter.post("/:id/like", requireSelf("employeeId"), async (req, res) => {
  const { employeeId } = req.body;

  const kudos = await Kudos.findById(req.params.id);
  if (!kudos) return res.status(404).json({ error: "Kudos not found" });

  const alreadyLiked = kudos.likedBy.includes(employeeId);
  kudos.likedBy = alreadyLiked ? kudos.likedBy.filter((id) => id !== employeeId) : [...kudos.likedBy, employeeId];
  await kudos.save();

  res.json(kudos);
});
