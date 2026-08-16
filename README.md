# Aurigin HR Backend

Express + MongoDB API for the [aurigin-hr-portal](../aurigin-hr-portal) frontend.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGODB_URI and JWT_SECRET
npm run seed            # populates the real org (Udit, Arjun, HR, Avantika,
                         # Gaurank Sharma, plus the "Sam" onboarding demo) and
                         # prints a one-time temp password for each account
npm run dev              # http://localhost:4000
```

`.env` is gitignored — it holds the MongoDB Atlas connection string and JWT
secret, and is never committed.

## API

All routes are mounted under `/api` and require a valid JWT (`Authorization:
Bearer <token>`), except `POST /auth/login` and `GET /health`. Mutating
routes are additionally gated: `requireRole` restricts an action to
specific roles (e.g. only admin/hr can add an employee or decide a leave/WFH
request), and `requireSelf` restricts self-service actions (check-in, apply
for leave/WFH, kudos) to the caller's own `employeeId`. Every collection
otherwise follows the same pattern: `GET` to list, `POST` to create, `PATCH`
to update.

| Resource | Routes |
|---|---|
| Auth | `POST /auth/login` (`{email, password}` → `{token, employee}`), `GET /auth/me`, `POST /auth/change-password` (`{currentPassword, newPassword}`) |
| Employees | `GET /employees`, `POST /employees` (admin/hr — returns a one-time `tempPassword`), `PATCH /employees/:id/complete-onboarding` (admin/hr) |
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
- Passwords are bcrypt-hashed (`passwordHash`, never returned by the API).
  New/seeded accounts get a random temp password and `mustChangePassword:
  true`; the frontend surfaces a change-password prompt for those.

## Deploying to Vercel

`api/[...path].js` is Vercel's zero-config catch-all route — every request
under `/api/*` resolves to this one serverless function with **no
vercel.json needed** (an earlier version used the legacy `builds`/`routes`
config, which turned out to be unreliable with this project's ESM + relative
imports and caused `FUNCTION_INVOCATION_FAILED` crashes; the catch-all
filename convention is the more robustly supported path). It wraps the same
Express app used for local dev (`src/app.js`) — `src/index.js` (with its
`.listen()` call) is local-dev-only and never invoked on Vercel. `db.js`
caches the Mongoose connection across warm invocations so requests don't
each open a new connection to Atlas.

1. Push this directory to its own GitHub repo (it's not one yet).
2. In the Vercel dashboard: **Add New… → Project**, import that repo.
3. Set these environment variables on the Vercel project (Settings →
   Environment Variables) — not in a committed file:
   - `MONGODB_URI` — the same Atlas connection string from `.env`
   - `JWT_SECRET` — the same random secret from `.env`
   - `CORS_ORIGIN` — the deployed frontend's origin, e.g.
     `https://aurigin-dashboard.vercel.app` (comma-separate multiple origins)
4. In MongoDB Atlas → Network Access, make sure `0.0.0.0/0` (Allow access
   from anywhere) is allowed — Vercel functions run from dynamic IPs, not a
   fixed one, so a locked-down allowlist will reject every connection.
5. Deploy. The API will be live at `https://<your-project>.vercel.app/api/...`.
6. Back on the frontend project, set `VITE_API_URL` to
   `https://<your-project>.vercel.app/api` and redeploy it.
