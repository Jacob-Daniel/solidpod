"use client";
import React, { useEffect, useState } from "react";
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";
import { getSolidDataset, getThing, getIri } from "@inrupt/solid-client";

export default function SolidLogin({ solidServer }) {
  const [webId, setWebId] = useState(null);
  const [podRoot, setPodRoot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleRedirect() {
      await handleIncomingRedirect({
        restorePreviousSession: true,
      });

      const session = getDefaultSession();

      if (session.info.isLoggedIn) {
        const webId = session.info.webId;
        setWebId(webId);

        try {
          const profileDoc = await getSolidDataset(webId);
          const profile = getThing(profileDoc, webId);
          const podRoot = getIri(
            profile,
            "http://www.w3.org/ns/pim/space#storage",
          );
          setPodRoot(podRoot);
        } catch (err) {
          console.error("Error loading profile or pod root", err);
        }
      }

      setLoading(false);
    }

    handleRedirect();
  }, []);

  const handleLogin = async () => {
    const callbackUrl = new URL("/callback", window.location.origin).toString();
    await login({
      oidcIssuer: solidServer,
      redirectUrl: callbackUrl,
      clientName: "My Solid App",
    });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}

      {!loading && webId && (
        <>
          <p>Logged in as: {webId}</p>
          {podRoot && <p>Pod Root: {podRoot}</p>}
        </>
      )}

      {!loading && !webId && (
        <>
          <p>Not logged in</p>
          <button
            className="border bg-white cursor-pointer p-2 py-1 rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
}
