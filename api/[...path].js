// Vercel serverless entrypoint. The [...path] filename is Vercel's
// zero-config catch-all convention — every request under /api/* (health,
// employees, auth, ...) resolves to this one file with no vercel.json
// routing needed. A trivial re-export on purpose: the Express app itself
// (src/app.js) is a valid (req, res) handler and now connects to the DB via
// its own middleware, so there's no extra wrapper function here that could
// end up being the thing Vercel actually tries to invoke instead of app.js.
import "dotenv/config";
import app from "../src/app.js";

export default app;
