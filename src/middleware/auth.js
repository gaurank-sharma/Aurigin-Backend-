import { verifyToken } from "../lib/auth.js";

/** Requires a valid `Authorization: Bearer <token>` header. Sets req.employeeId / req.role. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing or invalid Authorization header" });

  try {
    const payload = verifyToken(token);
    req.employeeId = payload.sub;
    req.role = payload.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/** Must run after requireAuth. Only lets the given roles through. */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.role)) return res.status(403).json({ error: "Not allowed for your role" });
    next();
  };
}

/** Must run after requireAuth. Only lets the request through if `req.body[field]` is the caller's own id. */
export function requireSelf(field) {
  return (req, res, next) => {
    if (req.body[field] !== req.employeeId) {
      return res.status(403).json({ error: "You can only do this for yourself" });
    }
    next();
  };
}
