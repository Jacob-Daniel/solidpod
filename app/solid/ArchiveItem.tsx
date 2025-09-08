"use client";
import { FC, useState, useEffect } from "react";
import EditFileForm from "./EditFileForm";
import { getSolidDataset, getThing } from "@inrupt/solid-client";
import ViewMode from "./ViewMode";

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

  const baseFragment = decodeURIComponent(
    resourceUrl.split("/").pop() || "",
  ).replace(/\.ttl$/, "");
  const filename = decodeURIComponent(
    resourceUrl.split("/").pop() || "",
  ).replace(/\.ttl$/, "");

  if (!dataset) return <p>Loading resource...</p>;

  const thingUrl = `${resourceUrl}#${filename}`;
  const thing = getThing(dataset, thingUrl);
  const fileName = filename.split("-")[0];

  return (
    <li className="flex flex-col border border-gray-300 dark:border-zinc-800 p-2 rounded-md">
      <div className="flex justify-between items-center">
        <span>{fileName}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === "view" ? "edit" : "view")}
            className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
          >
            {mode === "view" ? "Edit" : "Close"}
          </button>
          <button
            onClick={() => onDelete(resourceUrl)}
            className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
      {mode === "view" && dataset && (
        <ViewMode
          dataset={dataset}
          resourceUrl={resourceUrl}
          fragment={baseFragment}
        />
      )}
      {mode === "edit" && dataset && (
        <div className="mt-2">
          <EditFileForm
            dataset={dataset}
            resourceUrl={resourceUrl}
            thingUrl={thingUrl}
            fetch={fetch}
            onSave={() => setMode("view")}
          />
        </div>
      )}
    </li>
  );
};

export default ArchiveItem;
