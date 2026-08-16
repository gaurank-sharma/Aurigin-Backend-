import mongoose from "mongoose";
import { withIdJSON } from "./plugins.js";

const kudosSchema = new mongoose.Schema({
  fromId: { type: String, required: true, ref: "Employee" },
  toIds: [{ type: String, ref: "Employee" }],
  value: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  likedBy: [{ type: String, ref: "Employee" }],
});

withIdJSON(kudosSchema);

export const Kudos = mongoose.model("Kudos", kudosSchema);
