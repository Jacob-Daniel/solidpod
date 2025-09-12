"use client";

import { FC, useState, useEffect } from "react";
import { getSolidDataset, getThing } from "@inrupt/solid-client";
import PublicViewMode from "./PublicViewMode";

interface ArchiveItemProps {
  resourceUrl: string;
}

const ArchiveItem: FC<ArchiveItemProps> = ({ resourceUrl }) => {
  const [dataset, setDataset] = useState<any>(null);

  useEffect(() => {
    const loadDataset = async () => {
      try {
        const ds = await getSolidDataset(resourceUrl, { fetch });
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
  const filename = decodeURIComponent(
    resourceUrl.split("/").pop() || "",
  ).replace(/\.ttl$/, "");

  if (!dataset) return <p>Loading resource...</p>;

  const thingUrl = `${resourceUrl}#${filename}`;
  const thing = getThing(dataset, thingUrl);
  const fileName = filename.split("-")[0];
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
