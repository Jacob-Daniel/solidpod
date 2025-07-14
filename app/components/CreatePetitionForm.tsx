"use client";

import { useState } from "react";

export default function CreatePetitionForm() {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:1335/api/petitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If authenticated:
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: form }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Submission failed");
      }

      const result = await res.json();
      setMessage("Petition created successfully!");
      setForm({ title: "", summary: "", content: "" });
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold">Create Petition</h2>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
        placeholder="Petition Title"
        className="w-full border p-2 rounded"
      />

      <textarea
        name="summary"
        value={form.summary}
        onChange={handleChange}
        placeholder="Short Summary"
        className="w-full border p-2 rounded h-24"
      />

      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Petition Content"
        className="w-full border p-2 rounded h-48"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Create Petition"}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}
