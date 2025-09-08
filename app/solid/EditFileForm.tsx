"use client";
import { FC, useState, useEffect } from "react";
import {
  getThing,
  getStringNoLocale,
  setThing,
  setStringNoLocale,
  saveSolidDatasetAt,
  createThing,
  SolidDataset,
} from "@inrupt/solid-client";

interface EditFileFormProps {
  dataset: SolidDataset; // Pass the dataset from parent
  resourceUrl: string; // Needed for saving
  fetch: typeof fetch;
  onSave?: () => void;
}

interface Field {
  predicate: string;
  value: string;
}

const EditFileForm: FC<EditFileFormProps> = ({
  dataset,
  resourceUrl,
  fetch,
  onSave,
}) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [saving, setSaving] = useState(false);

  // Load Thing and extract string fields
  useEffect(() => {
    const thing =
      getThing(dataset, resourceUrl) ?? createThing({ url: resourceUrl });

    const stringFields: Field[] = Object.keys(thing.predicates).map(
      (predicate) => ({
        predicate,
        value: getStringNoLocale(thing, predicate) || "",
      }),
    );

    setFields(stringFields);
  }, [dataset, resourceUrl]);

  const handleChange = (predicate: string, value: string) => {
    setFields((prev) =>
      prev.map((f) => (f.predicate === predicate ? { ...f, value } : f)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let thing =
        getThing(dataset, resourceUrl) ?? createThing({ url: resourceUrl });

      fields.forEach((f) => {
        thing = setStringNoLocale(thing, f.predicate, f.value);
      });

      const updatedDataset = setThing(dataset, thing);
      await saveSolidDatasetAt(resourceUrl, updatedDataset, { fetch });

      if (onSave) onSave();
    } catch (err) {
      console.error("Error saving dataset:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {fields.length === 0 && <p>No string fields found in this resource.</p>}
      {fields.map((f) => (
        <div key={f.predicate} className="flex flex-col">
          <label className="font-medium">{f.predicate}</label>
          <input
            className="border p-2 rounded w-full"
            value={f.value}
            onChange={(e) => handleChange(f.predicate, e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saving}
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default EditFileForm;
