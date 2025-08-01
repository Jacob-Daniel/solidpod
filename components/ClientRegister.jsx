"use client";
import React, { useState } from "react";

export default function ClientRegister({ solidServer, onRegister }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerClient = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${solidServer}/.oidc/reg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: "My Test App",
          redirect_uris: [window.location.origin + "/callback"],
          grant_types: ["authorization_code"],
          response_types: ["code"],
          token_endpoint_auth_method: "client_secret_basic",
          scope: "openid webid offline_access",
        }),
      });

      if (!res.ok) throw new Error(`Registration failed: ${res.status}`);

      const data = await res.json();
      onRegister(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100">
      <h2>Register Client App</h2>
      <button className="border bg-gray-200 px-1" onClick={registerClient} disabled={loading}>
        {loading ? "Registering..." : "Register Client"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
