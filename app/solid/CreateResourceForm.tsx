"use client";
import { useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import { createArchiveResource } from "@/lib/createArchiveResource";
import { sanitizeStringTurtle } from "@/lib/sanitizeStringTurtle";
import { Category } from "@/lib/types";
import dynamic from "next/dynamic";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { saveFileInContainer } from "@inrupt/solid-client";

export default function CreateResourceForm({ cats }: { cats: Category[] }) {
  const { session } = useSolidSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCat] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: "",
    editorProps: {
      attributes: {
        class: "outline-none p-2 min-h-[150px]",
      },
    },
    immediatelyRender: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Saving...");
    const turtleTitle = sanitizeStringTurtle(title);
    try {
      const { resourceUrl, fragment } = await createArchiveResource(session, {
        title: turtleTitle,
        description,
        date,
        creator: session.info.webId!,
        category,
      });
      if (image) {
        const baseUrl = resourceUrl.split("/").slice(0, -1).join("/") + "/";
        const uploadUrl = baseUrl + "media/";

        await saveFileInContainer(uploadUrl, image, {
          slug: image.name,
          contentType: image.type,
          fetch: session.fetch,
        });

        setStatus(`Resource saved with image ${image.name}`);
      } else {
        const resource = resourceUrl.split("/").pop()?.split("#").pop();
        setStatus(`Resource saved ${resource}`);
      }
      setLoading(false);
    } catch (err: any) {
      setStatus(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 items-start">
      <h2 className="capitalize">new</h2>
      <select name="category" onChange={(e) => setCat(e.target.value)} required>
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
      <input
        className="border border-gray-300 dark:boarder-zinc-800 px-1 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <div className="border w-full p-1 rounded">
        <EditorContent editor={editor} />
      </div>

      <input
        className="border border-gray-300 dark:boarder-zinc-800 px-1 w-full"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (!e.target.files) return;
          setImage(e.target.files[0]);
        }}
      />
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
