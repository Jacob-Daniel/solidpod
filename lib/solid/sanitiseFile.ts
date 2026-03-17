/**
 * sanitiseFile.ts
 *
 * Client-side upload validation and string sanitisation utilities.
 *
 * NOTE: First line of defence only. Magic byte checks in the browser
 * are advisory — a determined user can bypass them by calling the pod
 * PUT endpoint directly. Your Solid server (CSS/ESS) is the
 * authoritative gatekeeper. Set X-Content-Type-Options: nosniff and
 * a strict Content-Security-Policy on your Next.js host.
 */

// ---------------------------------------------------------------------------
// Allowed types
// NOTE: image/svg+xml is intentionally excluded — SVG contains executable
// content (<script>, <foreignObject>, event handlers) and must never be
// treated as a safe image format.
// ---------------------------------------------------------------------------

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export const ALLOWED_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOC_TYPES,
] as const;

export type AllowedMimeType = (typeof ALLOWED_TYPES)[number];

// ---------------------------------------------------------------------------
// Magic byte signatures
// ---------------------------------------------------------------------------

const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  // WebP: RIFF header checked at bytes 0-3, fourcc 'WEBP' checked at 8-11
  // in a separate pass below — do not rely on this entry alone.
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  "image/gif": [[0x47, 0x49, 0x46, 0x38]],
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
  // OLE2 container (.doc) — also used by older Office formats;
  // extension check + server validation handles the specifics.
  "application/msword": [[0xd0, 0xcf, 0x11, 0xe0]],
  // ZIP/PK container (.docx)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    [0x50, 0x4b, 0x03, 0x04],
  ],
  // No reliable magic bytes for plain text
  "text/plain": [],
};

// ---------------------------------------------------------------------------
// Limits
// ---------------------------------------------------------------------------

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface SanitiseResult {
  ok: boolean;
  error?: string;
  safeName?: string;
  mime?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function readHeader(file: File, bytes: number): Promise<Uint8Array> {
  const buf = await file.slice(0, bytes).arrayBuffer();
  return new Uint8Array(buf);
}

function matchesMagic(header: Uint8Array, magic: number[]): boolean {
  return magic.every((byte, i) => header[i] === byte);
}

/** Strip path traversal, collapse whitespace, limit length. */
export function sanitiseFilename(name: string): string {
  return name
    .replace(/[/\\]/g, "") // no path separators
    .replace(/\.\./g, "") // no traversal sequences
    .replace(/\s+/g, "_") // spaces → underscores
    .replace(/[^\w.\-]/g, "") // only word chars, dots, hyphens
    .slice(0, 200);
}

/** Derive a safe content-type from the filename extension. */
export function extensionToMime(filename: string): AllowedMimeType | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, AllowedMimeType> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
  };
  return ext ? (map[ext] ?? null) : null;
}

/** Return the safe content-type to use when calling overwriteFile / PUT. */
export function safeContentType(file: File): string {
  return extensionToMime(file.name) ?? "application/octet-stream";
}

// ---------------------------------------------------------------------------
// Turtle / RDF identifier sanitiser
// ---------------------------------------------------------------------------

/**
 * Sanitise a string for use as a Turtle local name or RDF identifier.
 *
 * - Strips all characters outside [A-Za-z0-9_\-\.]
 * - Ensures the result starts with a letter or underscore
 * - Caps length to avoid oversized URIs and database field overflows
 *
 * @param name      - Raw input string
 * @param maxLength - Maximum output length (default 128)
 */
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

// ---------------------------------------------------------------------------
// Main validator
// ---------------------------------------------------------------------------

export async function validateUpload(
  file: File,
  allowedTypes: readonly string[] = ALLOWED_TYPES,
): Promise<ValidationResult> {
  // 1. Existence
  if (!file || file.size === 0) {
    return { valid: false, error: "No file selected or file is empty." };
  }

  // 2. Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const mb = (MAX_FILE_SIZE_BYTES / 1024 / 1024).toFixed(0);
    return { valid: false, error: `File exceeds the ${mb} MB limit.` };
  }

  // 3. MIME allowlist — derive from extension, never trust file.type alone
  const mimeFromExt = extensionToMime(file.name);
  const declaredMime = mimeFromExt ?? file.type;

  if (!allowedTypes.includes(declaredMime)) {
    return {
      valid: false,
      error: `File type "${declaredMime}" is not permitted.`,
    };
  }

  // 4. Magic bytes (skipped for text/plain — no reliable signature)
  if (declaredMime !== "text/plain") {
    const magicSets = MAGIC_BYTES[declaredMime];
    if (magicSets && magicSets.length > 0) {
      const header = await readHeader(file, 8);
      const matched = magicSets.some((magic) => matchesMagic(header, magic));
      if (!matched) {
        return {
          valid: false,
          error:
            "File contents do not match its declared type. Upload rejected.",
        };
      }
    }
  }

  // 5. WebP secondary check — verify RIFF fourcc is 'WEBP' at bytes 8-11.
  // The RIFF header alone (bytes 0-3) is shared with WAV, AVI, and other
  // formats, so a WAV renamed to .webp would pass step 4 without this check.
  if (declaredMime === "image/webp") {
    const header12 = await readHeader(file, 12);
    const isWebP =
      header12[8] === 0x57 && // W
      header12[9] === 0x45 && // E
      header12[10] === 0x42 && // B
      header12[11] === 0x50; // P
    if (!isWebP) {
      return {
        valid: false,
        error: "File contents do not match its declared type. Upload rejected.",
      };
    }
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Main entry point for components
// ---------------------------------------------------------------------------

export async function sanitiseFile(
  file: File,
  allowedTypes: readonly string[] = ALLOWED_TYPES,
): Promise<SanitiseResult> {
  const validation = await validateUpload(file, allowedTypes);
  if (!validation.valid) {
    return { ok: false, error: validation.error };
  }

  const safeName = sanitiseFilename(file.name);
  const mime = extensionToMime(file.name) ?? "application/octet-stream";

  return { ok: true, safeName, mime };
}
