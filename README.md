# Aurigin HR Backend

Express + MongoDB API for the [aurigin-hr-portal](../aurigin-hr-portal) frontend.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGODB_URI
npm run seed            # populates the real org (Udit, Arjun, HR, Avantika,
                         # Gaurank Sharma, plus the "Sam" onboarding demo)
npm run dev              # http://localhost:4000
```

`.env` is gitignored — it holds the MongoDB Atlas connection string and is
never committed.

## API

All routes are mounted under `/api`. Every collection follows the same
pattern: `GET` to list, `POST` to create, `PATCH` to update.

| Resource | Routes |
|---|---|
| Employees | `GET /employees`, `POST /employees`, `PATCH /employees/:id/complete-onboarding` |
| Leave requests | `GET /leave-requests`, `POST /leave-requests`, `PATCH /leave-requests/:id` (`{status, comment}`) |
| WFH requests | `GET /wfh-requests`, `POST /wfh-requests`, `PATCH /wfh-requests/:id` (`{status, comment}`) |
| Attendance | `GET /attendance`, `POST /attendance/check-in`, `POST /attendance/check-out`, `POST /attendance/wfh` (each takes `{employeeId}`) |
| Onboarding tasks | `GET /onboarding-tasks`, `PATCH /onboarding-tasks/:id` (`{status}`) |
| Kudos | `GET /kudos`, `POST /kudos`, `POST /kudos/:id/like` (`{employeeId}`) |
| Announcements | `GET /announcements`, `POST /announcements` |

`GET /health` returns `{ ok: true }` for uptime checks.

## Notes

- Employee `id` is a slug (`"gaurank-sharma"`), used as the Mongo `_id`
  directly, so it matches the ids `managerId`/`employeeId` fields already
  reference throughout the data model.
- There's no authentication layer — this mirrors the frontend's existing
  demo-style "pick an account" login, which never had passwords either.
  Add real auth here before this is exposed outside a trusted network.
## Deploying to Vercel

`vercel.json` + `api/index.js` wrap the Express app (`src/app.js`) as a
single serverless function — `src/index.js` (with its `.listen()` call) is
only used for local dev via `npm run dev` and is never invoked on Vercel.
`db.js` caches the Mongoose connection across warm invocations so requests
don't each open a new connection to Atlas.

1. Push this directory to its own GitHub repo (it's not one yet).
2. In the Vercel dashboard: **Add New… → Project**, import that repo.
3. Set these environment variables on the Vercel project (Settings →
   Environment Variables) — not in a committed file:
   - `MONGODB_URI` — the same Atlas connection string from `.env`
   - `CORS_ORIGIN` — the deployed frontend's origin, e.g.
     `https://aurigin-dashboard.vercel.app` (comma-separate multiple origins)
4. Deploy. The API will be live at `https://<your-project>.vercel.app/api/...`.
5. Back on the frontend project, set `VITE_API_URL` to
   `https://<your-project>.vercel.app/api` and redeploy it.
