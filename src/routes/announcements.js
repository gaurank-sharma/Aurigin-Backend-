import { Router } from "express";
import { Announcement } from "../models/Announcement.js";
import { todayISO } from "../lib/helpers.js";
import { requireRole } from "../middleware/auth.js";

export const announcementsRouter = Router();

announcementsRouter.get("/", async (_req, res) => {
  const announcements = await Announcement.find().sort({ date: -1 });
  res.json(announcements);
});

announcementsRouter.post("/", requireRole("admin", "hr"), async (req, res) => {
  const { title, body, category, authorId, pinned } = req.body;
  if (!title || !body || !category || !authorId) {
    return res.status(400).json({ error: "title, body, category, and authorId are required" });
  }
  const announcement = await Announcement.create({
    title,
    body,
    category,
    authorId,
    date: todayISO(),
    pinned: Boolean(pinned),
  });
  res.status(201).json(announcement);
});
