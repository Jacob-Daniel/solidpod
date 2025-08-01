"use client";
import React, { useEffect, useState } from "react";
import * as SolidClient from "@inrupt/solid-client";
import solidSession from "./SolidSession"; // your singleton

export default function SolidLogin({ solidServer }) {
  const [webId, setWebId] = useState(null);
  const [podRoot, setPodRoot] = useState(null);
  const [callbackUrl, setCallbackUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const callback = new URL("/callback", window.location.origin).toString();
      setCallbackUrl(callback);
    }

    async function handleRedirect() {
      await solidSession.handleIncomingRedirect({
        restorePreviousSession: true,
      });

      if (solidSession.info.isLoggedIn) {
        const webId = solidSession.info.webId;
        setWebId(webId);

        try {
          const profileDoc = await SolidClient.getSolidDataset(webId);
          const profile = SolidClient.getThing(profileDoc, webId);
          const podRoot = SolidClient.getIri(
            profile,
            "http://www.w3.org/ns/pim/space#storage",
          );
          setPodRoot(podRoot);
        } catch (err) {
          console.error("Error loading profile or pod root", err);
          setWebId(webId);
        }
      }

      setLoading(false);
    }

    handleRedirect();
  }, []);

  const handleLogin = async () => {
    if (!callbackUrl) {
      console.error("Missing callback URL");
      return;
    }

    await solidSession.login({
      clientName: "My Solid App",
      oidcIssuer: solidServer,
      redirectUrl: callbackUrl,
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
          <button onClick={handleLogin} disabled={!callbackUrl}>
            Login
          </button>
        </>
      )}
    </div>
  );
}
