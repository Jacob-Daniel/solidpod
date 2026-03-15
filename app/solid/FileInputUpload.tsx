import { FC, useState } from "react";
import { uploadFile } from "@/lib/uploadFile";
import { useSolidSession } from "@/lib/sessionContext";

interface FileInputUploadProps {
  accept: string;
  label: string;
  podRoot: string;
  subDir: string;
  visibility: boolean;
  onFileUploaded: (url: string) => void;
}

export const FileInputUpload: FC<FileInputUploadProps> = ({
  accept,
  label,
  podRoot,
  subDir,
  visibility,
  onFileUploaded,
}) => {
  const { session } = useSolidSession();
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setFileName(file.name);

    setUploading(true);
    try {
      const uploadedUrl = await uploadFile(
        session,
        file,
        podRoot,
        subDir,
        visibility,
      );
      onFileUploaded(uploadedUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="cursor-pointer bg-gray-400 text-white px-3 py-1 rounded mb-3">
      {label} {uploading ? "(Uploading...)" : fileName ? `(${fileName})` : ""}
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
};
