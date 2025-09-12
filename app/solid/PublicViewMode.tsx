"use client";
import { FC } from "react";
import { getThing, getStringNoLocale } from "@inrupt/solid-client";
import Image from "next/image";
interface ViewModeProps {
  dataset: any;
  resourceUrl: string;
  fragment?: string; // optional, from createArchiveResource
}

const PublicViewMode: FC<ViewModeProps> = ({
  dataset,
  resourceUrl,
  fragment,
}) => {
  const baseFragment =
    fragment ??
    decodeURIComponent(resourceUrl.split("/").pop() || "").replace(
      /\.ttl$/,
      "",
    );

  const thingUrl = `${resourceUrl}#${baseFragment}`;
  const thing = getThing(dataset, thingUrl);

  if (!thing) return <p>No data found in this resource.</p>;

  const stringFields = Object.entries(thing.predicates)
    .filter(([_, value]) => value.literals) // only predicates that have literals
    .map(([predicate, value]) => ({
      predicate,
      value: getStringNoLocale(thing, predicate) || "",
    }))
    .filter((f) => f.value); // remove empty strings

  if (stringFields.length === 0) return <p>No text fields to display.</p>;

  return (
    <div className="flex flex-col gap-2 pb-3">
      {stringFields.map((f) => {
        const fieldName = f.predicate.split("/").pop()?.split("#").pop();
        const name = f.value === "name" ? f.value : "resource";

        switch (fieldName) {
          case "img":
            return (
              <Image
                key={f.predicate}
                width={300}
                height={300}
                src={f.value}
                alt={name}
              />
            );

          case "description":
            return (
              <div
                key={f.predicate}
                className="prose" // optional for styling
                dangerouslySetInnerHTML={{ __html: f.value }}
              />
            );
          case "title":
            return (
              <h2 key={f.predicate} className="text-lg font-bold">
                {f.value}
              </h2>
            );
          default:
            return (
              <div key={f.predicate}>
                <span className="text-sm capitalize text-normal">
                  {fieldName}:
                </span>{" "}
                <span className="text-sm">{f.value}</span>
              </div>
            );
        }
      })}
    </div>
  );
};

export default PublicViewMode;
