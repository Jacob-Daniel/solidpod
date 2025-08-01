"use client";
import React from "react";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

export default function SolidSessionInfo({ session, onLogout }) {
  if (!session.info.isLoggedIn) {
    return <p>Not logged in.</p>;
  }

  const logout = async () => {
    await session.logout();
    onLogout();
  };

  return (
    <div>
      <p>
        Logged in as: <strong>{session.info.webId}</strong>
      </p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
