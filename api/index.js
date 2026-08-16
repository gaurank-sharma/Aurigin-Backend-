// Vercel serverless entrypoint. vercel.json rewrites every request here
// regardless of path — the filesystem catch-all convention
// (api/[...path].js) turned out to only match single-segment paths under
// /api/ in practice (multi-segment routes like /api/auth/login hit Vercel's
// own 404, never reaching Express), so this explicit rewrite replaces it.
// A trivial re-export on purpose: the Express app itself (src/app.js) is a
// valid (req, res) handler and connects to the DB via its own middleware,
// so there's no extra wrapper function here that could end up being the
// thing Vercel actually tries to invoke instead of app.js.
import "dotenv/config";
import app from "../src/app.js";

export default app;
