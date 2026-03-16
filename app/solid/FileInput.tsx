import { FC, useState } from "react";
import { validateUpload, ALLOWED_TYPES } from "@/lib/solid/sanitiseFile";

interface FileInputProps {
  accept: string;
  onFileSelected: (file: File) => void;
  label: string;
  /** Restrict validation to a subset of allowed MIME types. Defaults to all. */
  allowedTypes?: readonly string[];
}

export const FileInput: FC<FileInputProps> = ({
  accept,
  onFileSelected,
  label,
  allowedTypes = ALLOWED_TYPES,
}) => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const result = await validateUpload(file, allowedTypes);

    if (!result.valid) {
      setError(result.error ?? "Invalid file.");
      // Reset the input so the user can try again
      e.target.value = "";
      return;
    }

    setFileName(file.name);
    onFileSelected(file);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="cursor-pointer bg-gray-400 text-white px-3 py-1 rounded mb-3 self-start">
        {label} {fileName && `(${fileName})`}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </label>
      {error && (
        <p role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};
