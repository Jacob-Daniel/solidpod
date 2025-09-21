"use client";
import { FC, useState, useEffect } from "react";
import { getSolidDataset } from "@inrupt/solid-client";
import PublicViewMode from "@/app/solid/PublicViewMode";

interface ArchiveItemProps {
  resourceUrl: string;
}

const ArchiveItem: FC<ArchiveItemProps> = ({ resourceUrl }) => {
  const [dataset, setDataset] = useState<any>(null);
  useEffect(() => {
    const loadDataset = async () => {
      try {
        const ds = await getSolidDataset(resourceUrl, { fetch: window.fetch });
        setDataset(ds);
      } catch (err) {
        console.error("Error loading dataset:", err);
      }
    };
    loadDataset();
  }, [resourceUrl]);

  const baseFragment = decodeURIComponent(
    resourceUrl.split("/").pop() || "",
  ).replace(/\.ttl$/, "");

  if (!dataset) return <p>Loading resource...</p>;

  return (
    <li className="flex flex-col border-gray-300 border-b">
      <PublicViewMode
        dataset={dataset}
        resourceUrl={resourceUrl}
        fragment={baseFragment}
      />
    </li>
  );
};

export default ArchiveItem;
