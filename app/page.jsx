"use client";
import React, { useEffect, useState } from "react";
import { login, getDefaultSession } from "@inrupt/solid-client-authn-browser";

export default function Home() {
  const [solidServer] = useState("https://solidcommunity.net");

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
    const callbackUrl = new URL("/callback", window.location.origin).toString();
    console.log(callbackUrl);
    await login({
      oidcIssuer: "https://gardenmap.jacobdaniel.co.uk",
      redirectUrl: "http://localhost:3002/callback",
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
