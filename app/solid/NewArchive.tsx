"use client";
import { useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import { createArchiveResource } from "@/lib/createArchiveResource";
import { Category } from "@/lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { uploadFile } from "@/lib/uploadFile"; // our new helper
import { FileInput } from "@/app/solid/FileInput";

export default function CreateResourceForm({ cats }: { cats: Category[] }) {
  const { session, webId } = useSolidSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCat] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [allowAnnotations, setAllowAnnotations] = useState(false);
  const [document, setDocument] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: "",
    editorProps: { attributes: { class: "outline-none p-2 min-h-[150px]" } },
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
    immediatelyRender: false,
  });

  const podRoot = webId?.replace(/\/profile\/card#me$/, "") + "/";
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
        date,
        creator: session.info.webId!,
        visibility,
        category,
        image: imageUrl || "",
        documentUrl: documentUrl || "",
        allowAnnotations,
      });

      setMessage(`Resource saved!`);
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
        name="category"
        onChange={(e) => setCat(e.target.value)}
        required
      >
        <option value="" defaultChecked>
          Select Category
        </option>
        {cats.map((cat, i) => (
          <option key={i} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <label htmlFor="title">Title:</label>
      <input
        className="border border-border px-1 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="editor">Description:</label>
      <div className="border border-border mb-3 w-full p-1 rounded">
        <textarea
          value={description}
          className="w-full"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <FileInput
        label="Choose document to upload (.pdf, .doc, .docx, .txt)"
        accept=".pdf,.doc,.docx,.txt"
        onFileSelected={setDocument}
      />

      <FileInput
        label="Choose image to upload"
        accept="image/*"
        onFileSelected={setImage}
      />

      {/*      <label className="flex w-full gap-x-1 items-baseline">
        Allow annotations by other users:
        <input
          type="checkbox"
          checked={allowAnnotations}
          onChange={() => setAllowAnnotations((prev) => !prev)}
        />
      </label>*/}

      <label className="flex w-full gap-x-1 items-baseline">
        Permission Currently:{" "}
        {visibility ? (
          <span className="text-green-500">Public</span>
        ) : (
          <span className="text-red-500">Private</span>
        )}{" "}
        {!visibility && "Check box to set to Public:"}
        <input
          className="border-border px-1 text-black inline"
          type="checkbox"
          checked={visibility}
          onChange={() => setVisibility((prev) => !prev)}
          required
        />
      </label>

      <button
        className="border text-white cursor-pointer bg-blue-500 flex-shrink px-2 py-1 rounded mb-5"
        type="submit"
      >
        {loading ? "Processing..." : "Save"}
      </button>
      <p
        className={`py-1 px-2 ${status === "ok" && "bg-green-300 text-green-600"} ${status === "error" && "bg-red-500 text-red-600"}`}
      >
        {loading ? "" : message}
      </p>
    </form>
  );
}
