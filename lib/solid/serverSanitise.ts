/**
 * serverSanitise.ts
 *
 * Server-side upload enforcement layer.
 * Called in your Next.js API route / middleware BEFORE writing to the Solid pod.
 *
 * This is the authoritative gatekeeper — client-side checks in
 * uploadValidation.ts are advisory UX only.
 */

import {
  extensionToMime,
  ALLOWED_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "./sanitiseFile";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_DECOMPRESSED_RATIO = 100; // reject if decompressed > 100× compressed

// Patterns that must never appear in text/plain bodies
const TEXT_BODY_BLOCKLIST: RegExp[] = [
  /<script[\s>]/i,
  /<iframe[\s>]/i,
  /javascript\s*:/i,
  /\beval\s*\(/i,
  /new\s+Worker\s*\(/i,
  // Crypto miner endpoints — extend as needed
  /coinhive/i,
  /cryptonoter/i,
  /minero\.cc/i,
  /coin-hive/i,
  /webminerpool/i,
];

// PDF xref keys that indicate embedded JS
const PDF_JS_PATTERNS: RegExp[] = [
  /\/JavaScript/,
  /\/JS\b/,
  /\/Launch/,
  /\/SubmitForm/,
  /\/ImportData/,
];

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export interface ServerValidationResult {
  ok: boolean;
  error?: string;
  /** HTTP status code to return on rejection */
  status?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Decode buffer to string safely — replaces invalid UTF-8 sequences */
function bufferToString(buf: Buffer): string {
  return buf.toString("utf8");
}

// ---------------------------------------------------------------------------
// Per-type body scanners
// ---------------------------------------------------------------------------

/**
 * Scan a text/plain body for executable content.
 * Rejects HTML, inline JS, and known miner script patterns.
 */
function scanTextBody(buf: Buffer): ServerValidationResult {
  const body = bufferToString(buf);
  for (const pattern of TEXT_BODY_BLOCKLIST) {
    if (pattern.test(body)) {
      return {
        ok: false,
        status: 422,
        error: `File body contains disallowed content (matched: ${pattern.source}).`,
      };
    }
  }
  return { ok: true };
}

/**
 * Scan a PDF buffer for embedded JavaScript xref entries.
 * Does not parse the full PDF — scans raw bytes for known dangerous keys.
 * For production, replace with pdf-parse or pdfjs-dist for robustness.
 */
function scanPdfBody(buf: Buffer): ServerValidationResult {
  const body = bufferToString(buf);
  for (const pattern of PDF_JS_PATTERNS) {
    if (pattern.test(body)) {
      return {
        ok: false,
        status: 422,
        error: `PDF contains a disallowed action entry (${pattern.source}). Embedded scripts are not permitted.`,
      };
    }
  }
  return { ok: true };
}

/**
 * Check a ZIP-based file (docx, xlsx, etc.) for decompression bomb risk.
 * Reads the local file headers to sum uncompressed sizes without decompressing.
 *
 * ZIP local file header layout (per spec):
 *   0–3   signature  50 4B 03 04
 *   18–21 compressed size   (uint32 LE)
 *   22–25 uncompressed size (uint32 LE)
 */
function checkZipBomb(
  buf: Buffer,
  compressedSize: number,
): ServerValidationResult {
  let offset = 0;
  let totalUncompressed = 0;

  while (offset + 30 < buf.length) {
    // Look for local file header signature
    if (
      buf[offset] !== 0x50 ||
      buf[offset + 1] !== 0x4b ||
      buf[offset + 2] !== 0x03 ||
      buf[offset + 3] !== 0x04
    ) {
      break;
    }

    const uncompressed = buf.readUInt32LE(offset + 22);
    const compressed = buf.readUInt32LE(offset + 18);
    const fnameLen = buf.readUInt16LE(offset + 26);
    const extraLen = buf.readUInt16LE(offset + 28);

    totalUncompressed += uncompressed;

    if (
      compressedSize > 0 &&
      totalUncompressed > compressedSize * MAX_DECOMPRESSED_RATIO
    ) {
      return {
        ok: false,
        status: 422,
        error: `File rejected: decompression ratio exceeds ${MAX_DECOMPRESSED_RATIO}:1 (possible zip bomb).`,
      };
    }

    // Advance past this local header + file data
    offset += 30 + fnameLen + extraLen + compressed;
  }

  return { ok: true };
}

// ---------------------------------------------------------------------------
// Main server-side validator
// ---------------------------------------------------------------------------

/**
 * Validate an incoming file buffer server-side before writing to the Solid pod.
 *
 * Call this in your Next.js API route after receiving the upload:
 *
 *   const result = await serverValidateFile(buffer, filename, buffer.length);
 *   if (!result.ok) {
 *     return res.status(result.status ?? 400).json({ error: result.error });
 *   }
 *
 * @param buf        - Full file contents as a Buffer
 * @param filename   - Original filename (used for MIME derivation)
 * @param declaredSize - Content-Length from request headers (for zip bomb check)
 */
export async function serverValidateFile(
  buf: Buffer,
  filename: string,
  declaredSize: number,
): Promise<ServerValidationResult> {
  // 1. Size (re-check server-side — never trust client)
  if (buf.length === 0) {
    return { ok: false, status: 400, error: "Empty file." };
  }
  if (buf.length > MAX_FILE_SIZE_BYTES) {
    return { ok: false, status: 413, error: "File exceeds size limit." };
  }

  // 2. MIME from extension — never from Content-Type header alone
  const mime = extensionToMime(filename);
  if (!mime || !ALLOWED_TYPES.includes(mime)) {
    return {
      ok: false,
      status: 415,
      error: `File type not permitted: ${mime ?? "unknown"}.`,
    };
  }

  // 3. Per-type body scanning
  if (mime === "text/plain") {
    const scan = scanTextBody(buf);
    if (!scan.ok) return scan;
  }

  if (mime === "application/pdf") {
    const scan = scanPdfBody(buf);
    if (!scan.ok) return scan;
  }

  if (
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const scan = checkZipBomb(buf, declaredSize);
    if (!scan.ok) return scan;
  }

  return { ok: true };
}
