"use client";
import { useState } from "react";
import type { Signature } from "@/lib/types";

type User = {
  id: number;
  documentId: string;
  username: string;
  email: string;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type Props = {
  signatures: Signature[];
  totalCount: number;
  pageSize: number;
  slug: string;
};

const Signatures = ({ signatures, totalCount, pageSize, slug }: Props) => {
  const [items, setItems] = useState<Signature[]>(signatures);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API}/signatures?filters[petition][slug][$eq]=${slug}&filters[$and][1][comment][$notnull]=true&populate=user&pagination[page]=${nextPage}&pagination[pageSize]=${pageSize}&populate=user`,
    );

    const json = await res.json();

    setItems((prev) => [...prev, ...json.data]);
    setPage(nextPage);
    setLoading(false);

    const targetEl = document.getElementById("comments");
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasMore = items.length < totalCount;

  if (!signatures || signatures.length === 0) {
    return <p>No signed petitions found.</p>;
  }

  return (
    <section>
      <div className="mb-5">
        <p className="mb-3">
          Recent supporters who signed ({signatures.length})
        </p>
        <ul className="space-y-4 text-base">
          {items.map((sig) => (
            <li
              key={sig.id}
              className="p-4 border rounded-md border-gray-200 animate-fade-in"
            >
              <p className="text-sm text-gray-500">
                Signed on:{" "}
                <time dateTime={sig.createdAt}>
                  {formatDate(sig.createdAt)}
                </time>
              </p>
              {sig.comment && (
                <p className="mt-2 italic">Comment: "{sig.comment}"</p>
              )}
              {sig.anonymize ? (
                <p className="mt-2 text-gray-400">Signed anonymously</p>
              ) : (
                <p className="mt-2 font-semibold">
                  Signed by:{" "}
                  {sig?.user?.username || sig.first_name + " " + sig?.last_name}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div id="comments" className="mb-10">
        {(hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )) || <p className="text-gray-500 text-base">No more comments...</p>}
      </div>
    </section>
  );
};

export default Signatures;
