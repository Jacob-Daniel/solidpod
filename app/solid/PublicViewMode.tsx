"use client";
import { FC, useEffect, useState } from "react";
import { getThing, getStringNoLocale, getUrl } from "@inrupt/solid-client";
import Image from "next/image";
import { getNameFromWebId } from "@/lib/solidFunctions";
import Link from "next/link";

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
  const [creatorName, setCreatorName] = useState<string | null>(null);

  const thingUrl = `${resourceUrl}#${baseFragment}`;
  const thing = getThing(dataset, thingUrl);
  if (!thing) return <p>No data found in this resource.</p>;

  useEffect(() => {
    const creatorWebId = getUrl(thing, "http://purl.org/dc/terms/creator");
    if (!creatorWebId) return;

    getNameFromWebId(creatorWebId).then((name) => setCreatorName(name));
  }, [thing]);

  const stringFields = Object.entries(thing.predicates)
    .map(([predicate, value]) => {
      const literalValue = getStringNoLocale(thing, predicate);
      const urlValue = getUrl(thing, predicate);

      return {
        predicate,
        value: literalValue || urlValue || "",
        isUrl: !!urlValue,
      };
    })
    .filter((f) => f.value);

  if (stringFields.length === 0) return <p>No text fields to display.</p>;
  return (
    <div className="flex flex-col gap-2 pb-3">
      <div className="w-full grid grid-cols-12 gap-5">
        {/* Left column: image */}
        <div className="col-span-12 md:col-span-4">
          {stringFields.map((f) => {
            const fieldName = f.predicate.split("/").pop()?.split("#").pop();
            const name = f.value === "name" ? f.value : "resource";
            if (fieldName === "img") {
              return (
                <Image
                  key={f.predicate}
                  width={300}
                  height={300}
                  src={String(f.value)}
                  alt={name}
                />
              );
            }
            return null;
          })}
        </div>

        {/* Right column: metadata */}
        <div className="col-span-12 md:col-span-8 flex flex-col">
          {stringFields.map((f) => {
            const fieldName = f.predicate.split("/").pop()?.split("#").pop();

            switch (fieldName) {
              case "title":
                return (
                  <h2 key={f.predicate} className="text-lg font-bold">
                    {f.value}
                  </h2>
                );

              case "description":
                return (
                  <div
                    key={f.predicate}
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: f.value }}
                  />
                );
              case "file":
                if (f.value.endsWith(".pdf")) {
                  return (
                    <iframe
                      key={f.predicate}
                      src={f.value}
                      width="100%"
                      height="600"
                      title="PDF Preview"
                    />
                  );
                } else if (
                  f.value.endsWith(".doc") ||
                  f.value.endsWith(".docx")
                ) {
                  return (
                    <iframe
                      key={f.predicate}
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        f.value,
                      )}`}
                      width="100%"
                      height="600"
                      title="Word Preview"
                    />
                  );
                } else {
                  return (
                    <a
                      key={f.predicate}
                      href={f.value}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download File
                    </a>
                  );
                }

              case "creator":
                return (
                  <Link
                    key={f.predicate}
                    href={f.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    <i className="text-sm">By {creatorName || f.value}</i>
                  </Link>
                );

              case "date":
                return (
                  <div key={f.predicate}>
                    <span className="text-sm capitalize text-normal">
                      {fieldName}:
                    </span>{" "}
                    <span className="text-sm">{f.value}</span>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicViewMode;
