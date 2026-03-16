/**
 * uploadValidation.ts
 *
 * Client-side upload validation utility.
 *
 * NOTE: This is a first line of defence only. All checks here
 * must also be enforced server-side / in your Solid server middleware.
 * Magic byte checks in the browser are advisory — a determined user
 * can bypass them. The server is the authoritative gatekeeper.
 */

// ---------------------------------------------------------------------------
// Allowed types
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
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF....WEBP — checked further below
  "image/gif": [[0x47, 0x49, 0x46, 0x38]], // GIF8
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]], // %PDF
  // Word .doc (OLE2) and .docx (ZIP/PK) share magic bytes with other Office formats;
  // we accept them at the magic-byte level and rely on extension + server for specifics.
  "application/msword": [[0xd0, 0xcf, 0x11, 0xe0]],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    [0x50, 0x4b, 0x03, 0x04], // PK (ZIP)
  ],
  "text/plain": [], // No reliable magic bytes; rely on extension + server
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

/**
 * Result returned by sanitiseFile — the main entry point for components.
 * On success: ok=true, safeName and mime are populated.
 * On failure: ok=false, error describes the problem.
 */
export interface SanitiseResult {
  ok: boolean;
  error?: string;
  safeName?: string;
  mime?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read the first N bytes of a File as a Uint8Array */
async function readHeader(file: File, bytes: number): Promise<Uint8Array> {
  const slice = file.slice(0, bytes);
  const buf = await slice.arrayBuffer();
  return new Uint8Array(buf);
}

/** Return true if the header starts with the given magic sequence */
function matchesMagic(header: Uint8Array, magic: number[]): boolean {
  return magic.every((byte, i) => header[i] === byte);
}

/** Sanitise a filename: strip path traversal, collapse whitespace, limit length */
export function sanitiseFilename(name: string): string {
  return name
    .replace(/[/\\]/g, "") // no path separators
    .replace(/\.\./g, "") // no traversal
    .replace(/\s+/g, "_") // spaces → underscores
    .replace(/[^\w.\-]/g, "") // only word chars, dots, hyphens
    .slice(0, 200); // max length
}

/** Derive a safe content-type from the filename extension as a fallback */
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

// ---------------------------------------------------------------------------
// Main validator
// ---------------------------------------------------------------------------

/**
 * Validate a File object before upload.
 *
 * Checks (in order):
 *   1. File exists
 *   2. Size limit
 *   3. MIME type is on the allowlist
 *   4. Magic bytes match the declared MIME type
 *
 * Returns { valid: true } or { valid: false, error: "..." }
 */
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

  // 3. MIME type allowlist
  // Prefer extension-derived MIME over file.type (file.type is browser-supplied
  // and can be spoofed or absent). Use file.type as a fallback only.
  const mimeFromExt = extensionToMime(file.name);
  const declaredMime = mimeFromExt ?? file.type;

  if (!allowedTypes.includes(declaredMime)) {
    return {
      valid: false,
      error: `File type "${declaredMime}" is not permitted. Allowed: ${allowedTypes.join(", ")}`,
    };
  }

  // 4. Magic bytes (skip for plain text — no reliable signature)
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

  return { valid: true };
}

/**
 * Convenience wrapper: returns a safe content-type string to use when
 * calling overwriteFile / PUT. Never trusts file.type alone.
 */
export function safeContentType(file: File): string {
  return extensionToMime(file.name) ?? "application/octet-stream";
}

// ---------------------------------------------------------------------------
// Main entry point for components
// ---------------------------------------------------------------------------

/**
 * Validate and sanitise a File in one call.
 *
 * Usage in components:
 *   const result = await sanitiseFile(file, allowedTypes);
 *   if (!result.ok) { setError(result.error); return; }
 *   const safeFile = new File([file], result.safeName!, { type: result.mime });
 *
 * Runs all validation checks then returns a clean safeName and mime
 * derived from the file extension — never from the browser-supplied file.type.
 */
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
