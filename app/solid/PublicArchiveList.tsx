"use client";
import { FC } from "react";
import PublicArchiveItem from "@/app/solid/PublicArchiveItem";

interface ArchiveListProps {
  resources: string[];
}

const PublicArchiveList: FC<ArchiveListProps> = ({ resources }) => {
  return (
    <ul className="flex flex-col gap-y-7 text-primary">
      {resources.map((res) => (
        <PublicArchiveItem key={res} resourceUrl={res} />
      ))}
      {!resources.length && <p>Currently No Resources</p>}
    </ul>
  );
};

export default PublicArchiveList;
