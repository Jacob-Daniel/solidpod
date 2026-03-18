"use client";
import { FC } from "react";
import ArchiveItem from "@/app/solid/ArchiveItem";
import type { EditingResource } from "@/app/solid/TabComponent";

interface ArchiveListProps {
  resources: string[];
  fetch: typeof fetch;
  onDelete: (resourceUrl: string) => void;
  onEdit: (resource: EditingResource) => void;
}

const ArchiveList: FC<ArchiveListProps> = ({
  resources,
  fetch,
  onDelete,
  onEdit,
}) => {
  return (
    <ul className="flex flex-col gap-2">
      {resources.map((res) => (
        <ArchiveItem
          key={res}
          resourceUrl={res}
          fetch={fetch}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default ArchiveList;
