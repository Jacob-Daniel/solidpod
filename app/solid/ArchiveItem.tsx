"use client";
import { FC, useState, useEffect } from "react";
import EditFileForm from "./EditFileForm";
import { getSolidDataset, getThing } from "@inrupt/solid-client";
import ViewMode from "./ViewMode";
import Link from "next/link";
interface ArchiveItemProps {
  resourceUrl: string;
  fetch: typeof fetch;
  onDelete: (resourceUrl: string) => void;
}

const ArchiveItem: FC<ArchiveItemProps> = ({
  resourceUrl,
  fetch,
  onDelete,
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [dataset, setDataset] = useState<any>(null);

  useEffect(() => {
    const loadDataset = async () => {
      try {
        const ds = await getSolidDataset(resourceUrl, { fetch });
        setDataset(ds);
      } catch (err) {
        console.error(err);
      }
    };
    loadDataset();
  }, [resourceUrl, fetch]);

  if (!dataset) return <p>Loading resource...</p>;

  const url = new URL(resourceUrl);
  const parts = url.pathname.split("/").filter(Boolean);

  // parts = ["nkljacob", "archive", "events", "myfile.ttl"]
  const podName = parts[0];
  const archiveDir = parts[2];
  const fileName = parts[3];

  const query = new URLSearchParams({
    serverUrl: `${url.protocol}//${url.host}`,
    podName,
    archiveDir,
    fileName,
  }).toString();
  // const fileName = filename.split("-")[0].replaceAll("_", " ");
  return (
    <li className="flex flex-col border border-border p-2 rounded-md">
      <div className="flex justify-between items-center">
        <span>{fileName}</span>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/resource?${query}`}
            className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(resourceUrl)}
            className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default ArchiveItem;
