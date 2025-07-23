import React from "react";
import type { Signature } from "@/lib/types";

type User = {
  id: number;
  documentId: string;
  username: string;
  email: string;
};

type Props = {
  signatures: Signature[];
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const Signatures = ({ signatures }: { signatures: Signature[] }) => {
  if (!signatures || signatures.length === 0) {
    return <p>No signed petitions found.</p>;
  }

  return (
    <div className="mb-10">
      <p className="mb-3">Recent supporters who signed ({signatures.length})</p>
      <ul className="space-y-4">
        {signatures.map((sig) => (
          <li key={sig.id} className="p-4 border rounded-md shadow-sm">
            <p className="text-sm text-gray-500">
              Signed on:{" "}
              <time dateTime={sig.createdAt}>{formatDate(sig.createdAt)}</time>
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
  );
};

export default Signatures;
