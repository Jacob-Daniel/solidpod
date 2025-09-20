"use client";
import { useState, useEffect } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import { createArchiveResource } from "@/lib/createArchiveResource";
import { ensureContainerWithACL } from "@/lib/ensureContainerWithACL";
import { sanitizeStringTurtle } from "@/lib/sanitizeStringTurtle";
import { Category } from "@/lib/types";
// import dynamic from "next/dynamic";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { saveFileInContainer, overwriteFile } from "@inrupt/solid-client";

export default function CreateResourceForm({ cats }: { cats: Category[] }) {
  const { session, webId } = useSolidSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCat] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [document, setDocument] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: "",
    editorProps: {
      attributes: {
        class: "outline-none p-2 min-h-[150px]",
      },
    },
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
      // Or save JSON if you prefer
      // setDescription(JSON.stringify(editor.getJSON()));
    },
    immediatelyRender: false,
  });

  const safeSlug = (filename: string) => {
    return filename
      .trim()
      .replace(/\/+$/, "") // remove trailing slashes
      .replace(/\s+/g, "_") // replace spaces with underscores
      .replace(/[^a-zA-Z0-9._-]/g, ""); // remove bad chars
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Saving...");
    let documentUrl: string | undefined;

    const turtleTitle = sanitizeStringTurtle(title);
    let imageUrl: string | undefined;

    if (document) {
      const podRoot = webId?.replace(/\/profile\/card#me$/, "") + "/";
      const uploadUrl = new URL("archive/uploads/", podRoot).toString();
      console.log(uploadUrl, "uploadUrl", podRoot, "root");
      // Ensure container exists
      await ensureContainerWithACL(
        session,
        uploadUrl,
        visibility ? "public" : "private",
      );

      const slug = safeSlug(document.name); // removes spaces and trailing slashes
      const finalUrl = uploadUrl + slug;

      await overwriteFile(uploadUrl + slug, document, {
        contentType: document.type,
        fetch: session.fetch,
      });

      documentUrl = finalUrl;
    }

    try {
      if (image) {
        const podRoot = webId?.replace(/\/profile\/card#me$/, "") + "/";
        const uploadUrl = new URL("archive/uploads/", podRoot).toString();

        // Ensure container exists first
        await ensureContainerWithACL(
          session,
          uploadUrl,
          visibility ? "public" : "private",
        );

        const slug = safeSlug(image.name);
        const finalUrl = uploadUrl + slug;

        await overwriteFile(finalUrl, image, {
          contentType: image.type,
          fetch: session.fetch,
        });

        imageUrl = finalUrl;
      }

      await createArchiveResource(session, {
        title: turtleTitle,
        description,
        date,
        creator: session.info.webId!,
        visibility: visibility,
        category,
        image: imageUrl || "", // optional
        documentUrl: documentUrl || "",
      });

      setStatus(`Resource saved${image ? ` with image ${image.name}` : ""}`);
    } catch (err: any) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 items-start">
      <select
        className="mb-3 border border-gray-300"
        name="category"
        onChange={(e) => setCat(e.target.value)}
        required
      >
        <option value="" defaultChecked>
          Select Category
        </option>
        {cats.map((cat, i) => {
          return (
            <option key={i} value={cat.slug}>
              {cat.name}
            </option>
          );
        })}
      </select>
      <label htmlFor="title">Title:</label>

      <input
        className="border border-gray-300 dark:boarder-zinc-800 px-1 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label htmlFor="editor">Description:</label>
      <div className="border border-gray-300 mb-3 w-full p-1 rounded">
        <EditorContent editor={editor} />
      </div>
      <label className="cursor-pointer bg-gray-400 dark:bg-zinc-800 text-white px-3 py-1 rounded mb-2">
        Choose .pdf,.doc,.docx or .txt for Upload.{" "}
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => {
            if (!e.target.files) return;
            setDocument(e.target.files[0]);
          }}
        />
      </label>
      <label className="cursor-pointer bg-gray-400 dark:bg-zinc-800 text-white px-3 py-1 rounded mb-3">
        Choose Image for Upload.{" "}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (!e.target.files) return;
            setImage(e.target.files[0]);
          }}
        />
      </label>
      <label className="flex w-full gap-x-1 items-baseline">
        Permission Currently:{" "}
        {visibility ? (
          <span className="text-green-500">Public</span>
        ) : (
          <span className="text-red-500">Private</span>
        )}{" "}
        {!visibility && "Check box to set to Public:"}
        <input
          className="dark:boarder-zinc-800 px-1 text-black inline"
          type="checkbox"
          value={visibility ? 1 : 0}
          onChange={() => {
            setVisibility((prev) => !prev);
          }}
          required
        />
      </label>
      <button
        className="border text-white cursor-pointer bg-blue-500 flex-shrink px-2 py-1 rounded"
        type="submit"
      >
        {loading ? "Processing..." : "Save"}
      </button>
      <p>{loading ? "" : status}</p>
    </form>
  );
}
