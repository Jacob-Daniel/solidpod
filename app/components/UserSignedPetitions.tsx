"use client";

import React from "react";

type User = {
  id: number;
  documentId: string;
  username: string;
  email: string;
};

type Signature = {
  id: number;
  documentId: string;
  comment: string | null;
  anonymize: boolean;
  createdAt: string;
  user: User;
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

const SignedPetitionsList: React.FC<Props> = ({
  signatures,
}: {
  signatures: Signature[];
}) => {
  if (!signatures || signatures.length === 0) {
    return <p>No signed petitions found.</p>;
  }

  return (
    <div>
      <p className="mb-3">Petitions You Signed ({signatures.length})</p>
      <ul className="space-y-4 text-sm">
        {signatures.map((sig) => (
          <li key={sig.id} className="p-4 border border-gray-300 dark:border-zinc-800 rounded">
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
                Signed by: {sig.user.username || "Unknown User"}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SignedPetitionsList;
