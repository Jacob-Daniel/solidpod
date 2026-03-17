import { FC, useState } from "react";
import { uploadFile } from "@/lib/uploadFile";
import { useSolidSession } from "@/lib/sessionContext";
import {
  sanitiseFile,
  // ALLOWED_IMAGE_TYPES,
  // ALLOWED_DOC_TYPES,
  ALLOWED_TYPES,
} from "@/lib/solid/sanitiseFile";

interface FileInputUploadProps {
  accept: string;
  label: string;
  podRoot: string;
  subDir: string;
  visibility: boolean;
  onFileUploaded: (url: string) => void;
  /** Restrict to a subset of allowed types. Defaults to all permitted types. */
  allowedTypes?: string[];
}

export const FileInputUpload: FC<FileInputUploadProps> = ({
  accept,
  label,
  podRoot,
  subDir,
  visibility,
  onFileUploaded,
  allowedTypes = ALLOWED_TYPES,
}) => {
  const { session } = useSolidSession();
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    // ── Sanitise before touching the network ─────────────────────────────────
    const result = await sanitiseFile(file, allowedTypes);
    if (!result.ok) {
      setError(result.error ?? "Invalid file.");
      e.target.value = ""; // reset input
      return;
    }
    // Use the safe name and detected MIME from here on
    const safeFile = new File([file], result.safeName!, { type: result.mime });
    // ─────────────────────────────────────────────────────────────────────────

    setFileName(result.safeName!);
    setUploading(true);
    try {
      const uploadedUrl = await uploadFile(
        session,
        safeFile,
        podRoot,
        subDir,
        visibility,
      );
      onFileUploaded(uploadedUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="cursor-pointer bg-gray-400 text-white px-3 py-1 rounded mb-1 self-start">
        {label} {uploading ? "(Uploading...)" : fileName ? `(${fileName})` : ""}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </label>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};
