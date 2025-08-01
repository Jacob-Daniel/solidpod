"use client";
import { useEffect, useState } from "react";
import {
  handleIncomingRedirect,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";
import { getSolidDataset, getThing, getIri } from "@inrupt/solid-client";
import Link from "next/link";

export default function CallbackPage() {
  const [webId, setWebId] = useState(null);
  const [podRoot, setPodRoot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function completeLogin() {
      await handleIncomingRedirect();
      const session = getDefaultSession();
      if (session.info.isLoggedIn) {
        setWebId(session.info.webId);

        try {
          const profileDoc = await getSolidDataset(session.info.webId);
          const profile = getThing(profileDoc, session.info.webId);
          const podRoot = getIri(
            profile,
            "http://www.w3.org/ns/pim/space#storage",
          );
          setPodRoot(podRoot);
        } catch (err) {
          console.error("Error loading profile data:", err);
        }
      }

      setLoading(false);
    }

    completeLogin();
  }, []);

  return (
    <div>
      <h1>Callback Page</h1>
      {loading && <p>Loading...</p>}

      {!loading && webId && (
        <>
          <p>Logged in as: {webId}</p>
          {podRoot && <p>Pod Root: {podRoot}</p>}
        </>
      )}

      {!loading && !webId && (
        <div>
          <p>Not logged in.</p>
          <Link href="/" className="text-blue-400">
            Home
          </Link>
        </div>
      )}
    </div>
  );
}
