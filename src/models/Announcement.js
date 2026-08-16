import mongoose from "mongoose";
import { withIdJSON } from "./plugins.js";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, required: true },
  authorId: { type: String, required: true, ref: "Employee" },
  date: { type: String, required: true },
  pinned: { type: Boolean, default: false },
});

withIdJSON(announcementSchema);

export const Announcement = mongoose.model("Announcement", announcementSchema);
