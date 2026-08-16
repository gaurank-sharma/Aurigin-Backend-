import mongoose from "mongoose";

// Cached across invocations within the same warm serverless instance, so a
// burst of requests on Vercel reuses one connection instead of opening a
// new one per request and exhausting Atlas's connection limit.
let connectionPromise = null;

export function connectDB() {
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set — check your .env file");

  mongoose.set("strictQuery", true);
  connectionPromise = mongoose.connect(uri).then((conn) => {
    console.log("Connected to MongoDB");
    return conn;
  });
  connectionPromise.catch(() => {
    connectionPromise = null; // let the next request retry instead of staying stuck on a failed connection
  });

  return connectionPromise;
}
