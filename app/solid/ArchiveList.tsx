"use client";
import { FC } from "react";
import ArchiveItem from "@/app/solid/ArchiveItem";

interface ArchiveListProps {
  resources: string[];
  fetch: typeof fetch;
  onDelete: (resourceUrl: string) => void;
}

const ArchiveList: FC<ArchiveListProps> = ({ resources, fetch, onDelete }) => {
  return (
    <ul className="flex flex-col gap-2">
      {resources.map((res) => (
        <ArchiveItem
          key={res}
          resourceUrl={res}
          fetch={fetch}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default ArchiveList;
