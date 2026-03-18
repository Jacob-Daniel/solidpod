"use client";
import { FC, useState, useEffect } from "react";
import { getSolidDataset } from "@inrupt/solid-client";
import type { EditingResource } from "@/app/solid/TabComponent";

interface ArchiveItemProps {
  resourceUrl: string;
  fetch: typeof fetch;
  onDelete: (resourceUrl: string) => void;
  onEdit: (resource: EditingResource) => void;
}

const ArchiveItem: FC<ArchiveItemProps> = ({
  resourceUrl,
  fetch,
  onDelete,
  onEdit,
}) => {
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
  const fileName = parts[3];

  const handleEdit = () => {
    onEdit({
      resourceUrl,
      thingUrl: `${resourceUrl}#${fileName.replace(/\.ttl$/, "")}`,
      fileName,
    });
  };

  return (
    <li className="flex flex-col border border-border p-2 rounded-md">
      <div className="flex justify-between items-center">
        <span>{fileName}</span>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
          >
            Edit
          </button>
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
