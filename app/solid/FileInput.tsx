import { FC, useState } from "react";

interface FileInputProps {
  accept: string;
  onFileSelected: (file: File) => void;
  label: string;
}

export const FileInput: FC<FileInputProps> = ({
  accept,
  onFileSelected,
  label,
}) => {
  const [fileName, setFileName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setFileName(file.name);
    onFileSelected(file);
  };

  return (
    <label className="cursor-pointer bg-gray-400 text-white px-3 py-1 rounded mb-3">
      {label} {fileName && `(${fileName})`}
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
};
