// components/InruptLogin.jsx
"use client";
import { useEffect, useState } from "react";
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch as solidFetch
} from "@inrupt/solid-client-authn-browser";

export default function InruptLogin() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function init() {
      await handleIncomingRedirect();
      const sess = getDefaultSession();
      setSession(sess.info.isLoggedIn ? sess : null);
    }
    init();
  }, []);

  const doLogin = async () => {
    await login({
      oidcIssuer: "http://localhost:3000/app/",  // or user-selectable IdP
      redirectUrl: new URL("/", window.location.href).toString(),
      clientName: "NKL Inrupt App"
    });
  };

  const doLogout = async () => {
    const sess = getDefaultSession();
    await sess.logout();
    setSession(null);
  };

  return (
    <div className="col-span-12">
      {session ? (
        <div>
          <p>Logged in as: {session.info.webId}</p>
          <button className="bg-gray-200 p-1 border rounded-sm cursor-pointer" onClick={doLogout}>Logout</button>
        </div>
      ) : (
        <button className="bg-gray-200 p-1 border rounded-sm cursor-pointer" onClick={doLogin}>Login with Solid</button>
      )}
    </div>
  );
}
