export function sanitizeStringTurtle(name: string): string {
  if (!name) return "_";

  let sanitized = name.trim().replace(/[^A-Za-z0-9_\-\.]/g, "_");

  if (!/^[A-Za-z_]/.test(sanitized)) {
    sanitized = "_" + sanitized;
  }

  return sanitized;
}
