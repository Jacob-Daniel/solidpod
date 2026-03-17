import { describe, it, expect } from "vitest";
import {
  sanitiseFilename,
  extensionToMime,
  sanitizeStringTurtle,
  validateUpload,
} from "./sanitiseFile";

// ---------------------------------------------------------------------------
// Helper — build a fake File with controlled bytes and name
// ---------------------------------------------------------------------------

function makeFile(
  name: string,
  bytes: number[],
  type = "application/octet-stream",
): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46];
const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const WEBP_HEADER = [
  0x52,
  0x49,
  0x46,
  0x46, // RIFF
  0x00,
  0x00,
  0x00,
  0x00, // file size (irrelevant)
  0x57,
  0x45,
  0x42,
  0x50, // WEBP fourcc
];
const RIFF_WAV_HEADER = [
  0x52,
  0x49,
  0x46,
  0x46, // RIFF — same as WebP start
  0x00,
  0x00,
  0x00,
  0x00,
  0x57,
  0x41,
  0x56,
  0x45, // WAVE — not WEBP
];
const PDF_HEADER = [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34];
const PE_HEADER = [0x4d, 0x5a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

// ---------------------------------------------------------------------------
// sanitiseFilename
// ---------------------------------------------------------------------------

describe("sanitiseFilename", () => {
  it("strips path separators", () => {
    expect(sanitiseFilename("../../etc/passwd")).not.toContain("/");
    expect(sanitiseFilename("..\\windows\\system32")).not.toContain("\\");
  });

  it("strips traversal sequences", () => {
    expect(sanitiseFilename("../../secret.txt")).not.toContain("..");
  });

  it("replaces spaces with underscores", () => {
    expect(sanitiseFilename("my file.jpg")).toBe("my_file.jpg");
  });

  it("strips null bytes", () => {
    expect(sanitiseFilename("evil.jpg\x00.exe")).not.toContain("\x00");
  });

  it("strips RTLO unicode character", () => {
    expect(sanitiseFilename("evil\u202Epj.exe")).not.toContain("\u202E");
  });

  it("caps at 200 characters", () => {
    expect(sanitiseFilename("a".repeat(300))).toHaveLength(200);
  });

  it("leaves a normal filename unchanged", () => {
    expect(sanitiseFilename("photo.jpg")).toBe("photo.jpg");
  });
});

// ---------------------------------------------------------------------------
// extensionToMime
// ---------------------------------------------------------------------------

describe("extensionToMime", () => {
  it("returns correct MIME for known extensions", () => {
    expect(extensionToMime("photo.jpg")).toBe("image/jpeg");
    expect(extensionToMime("photo.jpeg")).toBe("image/jpeg");
    expect(extensionToMime("image.png")).toBe("image/png");
    expect(extensionToMime("clip.webp")).toBe("image/webp");
    expect(extensionToMime("doc.pdf")).toBe("application/pdf");
    expect(extensionToMime("file.docx")).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    expect(extensionToMime("note.txt")).toBe("text/plain");
  });

  it("returns null for unknown extensions", () => {
    expect(extensionToMime("script.exe")).toBeNull();
    expect(extensionToMime("archive.zip")).toBeNull();
    expect(extensionToMime("page.html")).toBeNull();
    expect(extensionToMime("image.svg")).toBeNull(); // SVG intentionally excluded
  });

  it("uses the last extension for double-extension filenames", () => {
    expect(extensionToMime("malware.pdf.exe")).toBeNull();
    expect(extensionToMime("real.exe.jpg")).toBe("image/jpeg");
  });
});

// ---------------------------------------------------------------------------
// sanitizeStringTurtle
// ---------------------------------------------------------------------------

describe("sanitizeStringTurtle", () => {
  it("returns _ for empty input", () => {
    expect(sanitizeStringTurtle("")).toBe("_");
  });

  it("strips RDF injection characters", () => {
    const out = sanitizeStringTurtle("user> ; <http://evil.com/pwned");
    expect(out).not.toContain(">");
    expect(out).not.toContain("<");
    expect(out).not.toContain(";");
  });

  it("strips unicode homoglyphs outside ASCII range", () => {
    // Cyrillic 'а' (U+0430) looks like Latin 'a' but is not
    const out = sanitizeStringTurtle("аdmin");
    expect(out).toMatch(/^[A-Za-z0-9_\-\.]+$/);
  });

  it("strips zero-width characters", () => {
    expect(sanitizeStringTurtle("admin\u200Buser")).not.toContain("\u200B");
  });

  it("prepends underscore when result starts with a digit", () => {
    expect(sanitizeStringTurtle("42user")).toMatch(/^_/);
  });

  it("prepends underscore when all chars are stripped", () => {
    const out = sanitizeStringTurtle("!!!###$$$");
    expect(out).toMatch(/^[A-Za-z_]/);
  });

  it("strips newlines to prevent line-break injection", () => {
    expect(sanitizeStringTurtle("user\nmalicious")).not.toContain("\n");
  });

  it("caps output at maxLength", () => {
    expect(sanitizeStringTurtle("a".repeat(500))).toHaveLength(128);
    expect(sanitizeStringTurtle("a".repeat(500), 64)).toHaveLength(64);
  });
});

// ---------------------------------------------------------------------------
// validateUpload — magic bytes + MIME
// ---------------------------------------------------------------------------

describe("validateUpload", () => {
  it("rejects empty file", async () => {
    const f = makeFile("photo.jpg", []);
    const r = await validateUpload(f);
    expect(r.valid).toBe(false);
  });

  it("rejects file over 20 MB", async () => {
    // Fake the size by creating a sparse array — too large to allocate fully,
    // so we spoof File.size via a Blob size property trick.
    const big = new File([new Uint8Array(1)], "big.jpg", {
      type: "image/jpeg",
    });
    Object.defineProperty(big, "size", { value: 21 * 1024 * 1024 });
    const r = await validateUpload(big);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/20 MB/);
  });

  it("rejects disallowed extension (.exe)", async () => {
    const f = makeFile("virus.exe", PE_HEADER);
    const r = await validateUpload(f);
    expect(r.valid).toBe(false);
  });

  it("rejects SVG (intentionally excluded)", async () => {
    const f = makeFile("icon.svg", [0x3c, 0x73, 0x76, 0x67]);
    const r = await validateUpload(f);
    expect(r.valid).toBe(false);
  });

  it("rejects HTML renamed to .txt — body not magic-checked but MIME accepted", async () => {
    // text/plain has no magic check — this is a known partial gap.
    // Server-side body scan must catch this.
    const f = makeFile("readme.txt", [0x3c, 0x68, 0x74, 0x6d, 0x6c]);
    const r = await validateUpload(f);
    // Client-side: passes (documented gap)
    expect(r.valid).toBe(true);
  });

  it("accepts valid JPEG", async () => {
    const f = makeFile("photo.jpg", JPEG_HEADER);
    const r = await validateUpload(f);
    expect(r.valid).toBe(true);
  });

  it("rejects PE executable with .jpg extension", async () => {
    const f = makeFile("photo.jpg", PE_HEADER);
    const r = await validateUpload(f);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/do not match/);
  });

  it("accepts valid PNG", async () => {
    const f = makeFile("image.png", PNG_HEADER);
    const r = await validateUpload(f);
    expect(r.valid).toBe(true);
  });

  it("accepts valid WebP with correct RIFF + WEBP fourcc", async () => {
    const f = makeFile("image.webp", WEBP_HEADER);
    const r = await validateUpload(f);
    expect(r.valid).toBe(true);
  });

  it("rejects WAV renamed to .webp — RIFF passes but WEBP fourcc fails", async () => {
    const f = makeFile("audio.webp", RIFF_WAV_HEADER);
    const r = await validateUpload(f);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/do not match/);
  });

  it("accepts valid PDF", async () => {
    const f = makeFile("doc.pdf", PDF_HEADER);
    const r = await validateUpload(f);
    expect(r.valid).toBe(true);
  });

  it("rejects double extension malware.pdf.exe", async () => {
    const f = makeFile("malware.pdf.exe", PE_HEADER);
    const r = await validateUpload(f);
    expect(r.valid).toBe(false);
  });

  it("rejects null byte filename evil.jpg\\x00.exe", async () => {
    const f = makeFile("evil.jpg\x00.exe", JPEG_HEADER);
    const r = await validateUpload(f);
    // Extension after null byte makes extensionToMime return null for "exe"
    // but the null byte itself is in the name — sanitiseFilename strips it
    expect(r.valid).toBe(false);
  });
});
