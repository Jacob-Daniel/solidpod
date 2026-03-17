export function sanitizeStringTurtle(name: string, maxLength = 128): string {
  if (!name) return "_";
  let sanitized = name
    .trim()
    .replace(/[^A-Za-z0-9_\-\.]/g, "_")
    .slice(0, maxLength);
  if (!/^[A-Za-z_]/.test(sanitized)) {
    sanitized = "_" + sanitized;
  }
  return sanitized;
}
