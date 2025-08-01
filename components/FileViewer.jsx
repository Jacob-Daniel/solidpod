// components/FileViewer.js
'use client';

import { getFile, getSolidDataset, getContainedResourceUrlAll } from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { useEffect, useState } from "react";

export default function FileViewer() {
  const session = getDefaultSession();
  const [files, setFiles] = useState([]);
  const [textContents, setTextContents] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      if (!session.info.webId) return;

      const folderUrl = new URL(session.info.webId).origin + "/public/";
      const dataset = await getSolidDataset(folderUrl, { fetch: session.fetch });
      const fileUrls = getContainedResourceUrlAll(dataset);
      setFiles(fileUrls);

      const texts = await Promise.all(
        fileUrls.map(async (url) => {
          try {
            const file = await getFile(url, { fetch: session.fetch });
            const text = await file.text();
            return { url, text };
          } catch {
            return { url, text: "[Could not load content]" };
          }
        })
      );

      setTextContents(texts);
    };

    loadFiles();
  }, [session]);

  return (
    <div className="col-span-12 space-y-4">
      {textContents.map(({ url, text }) => (
        <div key={url} className="border p-4 rounded bg-gray-50">
          <p className="text-sm text-gray-600">📄 {url}</p>
          <pre className="whitespace-pre-wrap mt-2">{text}</pre>
        </div>
      ))}
    </div>
  );
}
