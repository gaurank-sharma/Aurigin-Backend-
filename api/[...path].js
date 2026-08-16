// Vercel serverless entrypoint. The [...path] filename is Vercel's
// zero-config catch-all convention — every request under /api/* (health,
// employees, auth, ...) resolves to this one file with no vercel.json
// routing needed, which is more reliably supported than the legacy
// builds/routes config this replaced. Wraps the same Express app used for
// local dev (src/app.js), ensuring the MongoDB connection is ready before
// each request — connectDB() caches its connection promise, so warm
// invocations reuse it instead of reconnecting.
import "dotenv/config";
import { app } from "../src/app.js";
import { connectDB } from "../src/db.js";

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
