"use client";
import { useEffect, useState } from "react";
import * as SolidClient from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import Link from "next/link";

export default function CallBack() {
  const session = new Session();
  const [webId, setWebId] = useState(null);
  const [podRoot, setPodRoot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solidClient, setSolidClient] = useState();

  useEffect(() => {
    async function handleRedirect() {
      await session.handleIncomingRedirect({ restorePreviousSession: true });

      if (session.info.isLoggedIn) {
        const webId = session.info.webId;
        setWebId(webId);

        try {
          const profileDoc = await SolidClient.getSolidDataset(webId);
          const profile = SolidClient.getThing(profileDoc, webId);
          const storage = SolidClient.getIri(
            profile,
            "http://www.w3.org/ns/pim/space#storage",
          );
          setPodRoot(storage);
          setSolidClient(profile);
        } catch (err) {
          console.error("Error loading profile data:", err);
        }
      } else {
        setWebId(null);
      }

      setLoading(false);
    }

    handleRedirect();
  }, []);
  console.log(webId, solidClient, "client");
  return (
    <div className="col-span-10 mb-10 flex flex-col gap-y-10">
      <div className="w-100p-2">
        <p>Page CallBack</p>
      </div>
      <div className="w-100 bg-blue-200 p-2">
        {loading && <p>Loading...</p>}
        {!loading && webId && (
          <>
            <p>Logged in as: {webId}</p>
            {podRoot && <p>Pod Root: {podRoot}</p>}
          </>
        )}
        {!loading && !webId && (
          <div>
            <p>Not logged in </p>
            <Link href="/" className="text-blue-400">
              Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
