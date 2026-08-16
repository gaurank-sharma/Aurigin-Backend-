// Vercel serverless entrypoint — wraps the same Express app used for local
// dev (src/app.js), ensuring the MongoDB connection is ready before each
// request. connectDB() caches its connection promise, so warm invocations
// reuse it instead of reconnecting.
import "dotenv/config";
import { app } from "../src/app.js";
import { connectDB } from "../src/db.js";

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
