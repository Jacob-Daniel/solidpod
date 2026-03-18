"use client";

import { useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import { createArchiveResource } from "@/lib/createArchiveResource";
import { Category } from "@/lib/types";
import { uploadFile } from "@/lib/uploadFile";
import { FileInput } from "@/app/solid/FileInput";

export default function CreateResourceForm({ cats }: { cats: Category[] }) {
  const { session, webId, isVerified } = useSolidSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCat] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [document, setDocument] = useState<File | null>(null);

  const podRoot = webId ? webId.replace(/\/profile\/card#me$/, "") + "/" : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Saving...");

    try {
      let documentUrl: string | undefined;
      let imageUrl: string | undefined;

      if (document) {
        documentUrl = await uploadFile(
          session,
          document,
          podRoot,
          "archive/uploads/",
          visibility,
        );
      }

      if (image) {
        imageUrl = await uploadFile(
          session,
          image,
          podRoot,
          "archive/uploads/",
          visibility,
        );
      }

      await createArchiveResource(session, {
        title,
        description,
        creator: session.info.webId ?? "",
        visibility,
        category,
        image: imageUrl || "",
        documentUrl: documentUrl || "",
      });

      setMessage("Resource saved!");
      setStatus("ok");
    } catch (err: any) {
      setMessage(err.message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 items-start">
      <select
        className="mb-3 border border-border"
        onChange={(e) => setCat(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {cats.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <label>Title:</label>
      <input
        className="border border-border px-1 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Description:</label>
      <textarea
        value={description}
        className="border border-border mb-3 w-full p-1 rounded"
        onChange={(e) => setDescription(e.target.value)}
      />

      <FileInput
        label="Choose document (.pdf, .doc, .docx, .txt)"
        accept=".pdf,.doc,.docx,.txt"
        onFileSelected={setDocument}
      />

      <FileInput
        label="Choose image"
        accept="image/*"
        onFileSelected={setImage}
      />

      <label className="flex w-full gap-x-1 items-baseline">
        Permission:
        {visibility ? (
          <span className="text-green-500">Public</span>
        ) : (
          <span className="text-red-500">Private</span>
        )}
        <input
          type="checkbox"
          checked={visibility}
          onChange={() => setVisibility((prev) => !prev)}
        />
      </label>

      <button
        className="border text-white px-2 py-1 rounded mb-5 transition-colors
          bg-blue-500 enabled:cursor-pointer 
          disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        type="submit"
        disabled={!isVerified || loading}
        title={!isVerified ? "Your account is pending verification" : undefined}
      >
        {loading ? "Processing..." : "Save"}
      </button>

      <p
        className={`py-1 px-2 ${
          status === "ok" && "bg-green-300 text-green-600"
        } ${status === "error" && "bg-red-500 text-red-600"}`}
      >
        {!loading && message}
      </p>
    </form>
  );
}
