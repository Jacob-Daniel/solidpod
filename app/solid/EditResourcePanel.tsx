"use client";
import { useEffect, useState } from "react";
import { getSolidDataset } from "@inrupt/solid-client";
import { useSolidSession } from "@/lib/sessionContext";
import EditFileForm from "@/app/solid/EditFileForm";
import type { EditingResource } from "@/app/solid/TabComponent";

interface Props {
  resource: EditingResource;
  onBack: () => void;
}

export default function EditResourcePanel({ resource, onBack }: Props) {
  const { session } = useSolidSession();
  const [dataset, setDataset] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setDataset(null);
    setError("");
    const load = async () => {
      try {
        const ds = await getSolidDataset(resource.resourceUrl, {
          fetch: session.fetch,
        });
        setDataset(ds);
      } catch (err) {
        console.error("Error loading dataset:", err);
        setError("Could not load resource.");
      }
    };
    load();
  }, [resource.resourceUrl, session.fetch]);

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        ← Back to Archive List
      </button>
      <h1 className="text-xl font-bold mb-4">Edit {resource.fileName}</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!dataset && !error && (
        <p className="text-sm text-neutral-400">Loading…</p>
      )}
      {dataset && (
        <EditFileForm
          dataset={dataset}
          resourceUrl={resource.resourceUrl}
          thingUrl={resource.thingUrl}
          fetch={session.fetch}
        />
      )}
    </div>
  );
}
