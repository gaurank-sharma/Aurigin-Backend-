export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function uniqueEmployeeId(baseSlug, Employee) {
  let id = baseSlug;
  let n = 2;
  while (await Employee.exists({ _id: id })) {
    id = `${baseSlug}-${n}`;
    n += 1;
  }
  return id;
}

export async function uniqueEmail(name, Employee) {
  const parts = name.toLowerCase().trim().split(/\s+/);
  const base = parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0];
  const clean = base.replace(/[^a-z0-9.]/g, "");
  let email = `${clean}@auriginmedia.com`;
  let n = 2;
  while (await Employee.exists({ email })) {
    email = `${clean}${n}@auriginmedia.com`;
    n += 1;
  }
  return email;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetweenInclusive(startIso, endIso) {
  const start = new Date(startIso + "T00:00:00");
  const end = new Date(endIso + "T00:00:00");
  return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

export function nowTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}
