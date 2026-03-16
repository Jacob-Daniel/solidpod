"use client";
import { FC, useState, useEffect } from "react";
import {
  overwriteFile,
  SolidDataset,
  Thing,
  setStringNoLocale,
  getStringNoLocale,
} from "@inrupt/solid-client";
import {
  sanitiseFile,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOC_TYPES,
  ALLOWED_TYPES,
} from "@/lib/solid/sanitiseFile";

interface EditFileUploaderProps {
  dataset: SolidDataset;
  thing: Thing;
  predicate: string;
  uploadsFolder: string;
  fetch: typeof fetch;
  onThingUpdate: (updatedThing: Thing) => void;
  label: string;
  accept: string;
  /** Restrict to a subset of allowed types. Defaults to all permitted types. */
  allowedTypes?: string[];
}

const EditFileUploader: FC<EditFileUploaderProps> = ({
  dataset,
  thing,
  predicate,
  uploadsFolder,
  fetch,
  onThingUpdate,
  label,
  accept,
  allowedTypes = ALLOWED_TYPES,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = getStringNoLocale(thing, predicate) || "";
    setCurrentUrl(url);
  }, [thing, predicate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFile(null);
    if (!e.target.files || e.target.files.length === 0) return;
    const raw = e.target.files[0];

    // ── Validate before staging ───────────────────────────────────────────────
    const result = await sanitiseFile(raw, allowedTypes);
    if (!result.ok) {
      setError(result.error ?? "Invalid file.");
      e.target.value = "";
      return;
    }
    // Rebuild File with safe name and verified MIME type
    const safeFile = new File([raw], result.safeName!, { type: result.mime });
    // ─────────────────────────────────────────────────────────────────────────

    setFile(safeFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      // file.name is already the sanitised name set in handleFileChange
      const fileUrl = uploadsFolder + file.name;

      await overwriteFile(fileUrl, file, {
        // Use the verified MIME, NOT the original file.type from the browser
        contentType: file.type,
        fetch,
      });

      const updatedThing = setStringNoLocale(thing, predicate, fileUrl);
      onThingUpdate(updatedThing);
      setCurrentUrl(fileUrl);
      setFile(null);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUrl) return;
    setError(null);

    try {
      await fetch(currentUrl, { method: "DELETE" });
      const updatedThing = setStringNoLocale(thing, predicate, "");
      onThingUpdate(updatedThing);
      setCurrentUrl("");
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Delete failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-5">
      {currentUrl && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="px-2 py-1 text-white bg-red-500 rounded pointer"
          >
            Delete File
          </button>
        </div>
      )}

      <input
        name={predicate.split(/[/#]/).pop()}
        className="border border-border bg-background rounded self-start flex-none px-2 py-1 bg-gray-200 pointer"
        type="file"
        accept={accept}
        onChange={handleFileChange}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-2 py-1 text-white bg-blue-500 rounded"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};

export default EditFileUploader;
