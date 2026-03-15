"use client";
import { FC, useState, useEffect } from "react";
import {
  overwriteFile,
  SolidDataset,
  Thing,
  setStringNoLocale,
  setThing,
  getStringNoLocale,
} from "@inrupt/solid-client";

interface EditFileUploaderProps {
  dataset: SolidDataset;
  thing: Thing;
  predicate: string; // e.g., DC("file") or DC("img")
  uploadsFolder: string; // URL of the folder to upload files
  fetch: typeof fetch;
  onThingUpdate: (updatedThing: Thing) => void; // Callback to parent
  label: string;
  accept: string; // file types, e.g., "image/*" or ".pdf,.doc,.docx,.txt"
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
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  // Initialize currentUrl from the Thing safely
  useEffect(() => {
    const url = getStringNoLocale(thing, predicate) || "";
    setCurrentUrl(url);
  }, [thing, predicate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // Create safe filename
      const safeName = file.name.replace(/\s+/g, "_");
      const fileUrl = uploadsFolder + safeName;

      // Upload or overwrite file
      await overwriteFile(fileUrl, file, { contentType: file.type, fetch });

      // Update Thing predicate
      const updatedThing = setStringNoLocale(thing, predicate, fileUrl);

      onThingUpdate(updatedThing);
      setCurrentUrl(fileUrl);
      setFile(null);
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUrl) return;

    try {
      await fetch(currentUrl, { method: "DELETE" });
      const updatedThing = setStringNoLocale(thing, predicate, "");
      onThingUpdate(updatedThing);
      setCurrentUrl("");
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-5">
      {currentUrl && (
        <div className="flex items-center gap-2">
          <label className="font-medium">
            <button
              onClick={handleDelete}
              className="px-2 py-1 text-white bg-red-500 rounded pointer"
            >
              Delete File
            </button>
          </label>
        </div>
      )}

      <input
        name={predicate.split(/[\/#]/).pop()}
        className="border border-border bg-background rounded self-start flex-none px-2 py-1 bg-gray-200 pointer"
        type="file"
        accept={accept}
        onChange={handleFileChange}
      />

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
