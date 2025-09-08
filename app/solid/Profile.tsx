"use client";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";

import {
  getSolidDataset,
  getThing,
  setStringNoLocale,
  setThing,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { FOAF } from "@inrupt/vocab-common-rdf";

const Profile: FC = () => {
  const [name, setName] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const {
    isLoggedIn,
    webId,
    session,
    fullName,
    email: userEmail,
  } = useSolidSession();
  const [email, setEmail] = useState<string | "">(userEmail || "");
  const handleSave = async () => {
    if (!webId) return;
    setSaving(true);

    const dataset = await getSolidDataset(webId, {
      fetch: session.fetch,
    });
    let thing = getThing(dataset, webId);
    if (!thing) return;

    thing = setStringNoLocale(thing, FOAF.name, name);

    const updatedDataset = setThing(dataset, thing);
    await saveSolidDatasetAt(webId, updatedDataset, {
      fetch: session.fetch,
    });

    setSaving(false);
  };

  if (!isLoggedIn) {
    return <p>Loading...</p>;
  }

  return (
    <div className="col-span-12">
      <p>{fullName ? `Hello, ${fullName}` : "Not logged in"}</p>
      <p>Email: {email || "no email"}</p>
      <div className="flex flex-col gap-3 items-start">
        <input
          className="border border-gray-300 dark:border-zinc-800 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
        <input
          className="border border-gray-300 dark:border-zinc-800 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="border text-white cursor-pointer bg-blue-500 flex-shrink px-2 py-1 rounded"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
