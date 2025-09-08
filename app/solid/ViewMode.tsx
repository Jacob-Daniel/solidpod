"use client";
import { FC } from "react";
import { getThing, getStringNoLocale } from "@inrupt/solid-client";

interface ViewModeProps {
  dataset: any;
  resourceUrl: string;
  fragment?: string; // optional, from createArchiveResource
}

const ViewMode: FC<ViewModeProps> = ({ dataset, resourceUrl, fragment }) => {
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
    <div className="mt-2 flex flex-col gap-2 p-2 rounded">
      {stringFields.map((f) => {
        const fieldName = f.predicate.split("/").pop()?.split("#").pop();

        return (
          <div key={f.predicate}>
            <strong className="font-medium capitalize">{fieldName}:</strong>{" "}
            <span>{f.value}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ViewMode;
