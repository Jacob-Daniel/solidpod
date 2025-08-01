// components/FileUpload.js
'use client';

import { getSolidDataset, saveFileInContainer } from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { useState } from "react";

export default function FileUpload() {
  const session = getDefaultSession();
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file || !session.info.webId) return;

    const containerUri = new URL(session.info.webId).origin + "/public/"; // Upload to user's /public folder
    await saveFileInContainer(containerUri, file, {
      slug: file.name,
      contentType: file.type,
      fetch: session.fetch,
    });
    alert("File uploaded!");
  };

  return (
    <div className={`col-span-12 flex gap-3 ${session.info && 'hidden'}`}>
      <input
        className="border px-1"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".txt,.md"
      />
      <button onClick={upload} className="border bg-gray-200 px-1">
        Upload
      </button>
    </div>
  );
}
