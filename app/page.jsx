"use client";
import React, { useEffect, useState } from "react";
import { login, getDefaultSession } from "@inrupt/solid-client-authn-browser";

export default function Home() {
  const [solidServer] = useState("https://gardenmap.jacobdaniel.co.uk/");

  const [webId, setWebId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      setWebId(session.info.webId);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    await login({
      oidcIssuer: "https://gardenmap.jacobdaniel.co.uk",
      redirectUrl: "https://solidpod.jacobdaniel.co.uk/callback",
      clientName: "My Solid App",
    });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}

      {!loading && webId && (
        <>
          <p>Logged in as: {webId}</p>
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
