"use client";
import { useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import { createArchiveResource } from "@/lib/createArchiveResource";

export default function CreateResourceForm() {
  const { session } = useSolidSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ckli");
    setLoading(true);
    setStatus("Saving...");
    try {
      const url = await createArchiveResource(session, {
        title,
        description,
        date,
        creator: session.info.webId!,
      });
      setStatus(`Resource saved at ${url}`);
      setLoading(false);
    } catch (err: any) {
      setStatus(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 items-start">
      <input
        className="border border-gray-300 px-1 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        className="border border-gray-300 px-1 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        className="border border-gray-300 px-1 w-full"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
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
