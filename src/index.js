// Local dev entrypoint (`npm run dev` / `npm start`). Vercel doesn't use
// this file — see api/index.js, which wraps the same `app` as a serverless
// function instead of calling .listen().
import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./db.js";

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Aurigin HR API listening on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
