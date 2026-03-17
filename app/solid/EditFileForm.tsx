"use client";
import { FC, useState, useEffect, useRef } from "react";
import {
  SolidDataset,
  Thing,
  getThing,
  getStringNoLocale,
  setThing,
  setStringNoLocale,
  saveSolidDatasetAt,
  createThing,
  setUrl,
} from "@inrupt/solid-client";
import Image from "next/image";
import { useSolidSession } from "@/lib/sessionContext";

// import EditDescription from "./EditDescription";
import { FileInputUpload } from "@/app/solid/FileInputUpload";
// import { uploadFile } from "@/lib/uploadFile";
// import namespace from "@rdfjs/namespace";
import MessageModal from "@/app/components/MessageModal";

// const DC = namespace("http://purl.org/dc/terms/");

interface EditFileFormProps {
  dataset: SolidDataset;
  resourceUrl: string;
  thingUrl: string;
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
  thingUrl,
  fetch,
}) => {
  const existingThing = getThing(dataset, thingUrl);
  const initialThing = existingThing ?? createThing({ url: thingUrl });
  const [thing, setThingState] = useState<Thing>(initialThing);
  const formRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState<Field[]>([]);
  // const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const { webId } = useSolidSession();
  // const [visibility, setVisibility] = useState(false);

  // const uploadsFolder = resourceUrl.replace(/\/[^\/]+$/, "/") + "uploads/";
  const podRoot = webId?.replace(/\/profile\/card#me$/, "") + "/";
  useEffect(() => {
    if (!thing) return;

    const stringFields: Field[] = Object.keys(thing.predicates ?? {})
      .filter((p) => thing.predicates?.[p]?.literals)
      .map((predicate) => ({
        predicate,
        value: getStringNoLocale(thing, predicate) || "",
      }));

    setFields(stringFields);
  }, [thing]);

  const handleChange = (predicate: string, value: string) => {
    setFields((prev) =>
      prev.map((f) => (f.predicate === predicate ? { ...f, value } : f)),
    );
  };

  // const handleThingUpdate = (updatedThing: Thing) => {
  //   setThingState(updatedThing);
  // };

  const renderFilePreview = (predicateUrl: string) => {
    const fileUrl = getStringNoLocale(thing, predicateUrl);
    if (!fileUrl) return null;
    const extension = fileUrl.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
        return (
          <div>
            <Image
              src={fileUrl}
              alt={predicateUrl}
              className="max-h-40 mb-2 border border-border p-[2px]"
              width={150}
              height={150}
              style={{ objectFit: "cover" }}
            />
          </div>
        );
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return (
          <iframe
            src={fileUrl}
            width="100%"
            height="400"
            title="File Preview"
          />
        );
      default:
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mb-2 block"
          >
            Download {predicateUrl.split("/").pop()}
          </a>
        );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    setProcessing(true);
    setMessage("processing...");

    try {
      let updatedThing = thing;
      const formData = new FormData(formRef.current);

      for (const [name, value] of formData.entries()) {
        if (!value) continue;
        const fullPredicate = fields.find(
          (f) => f.predicate.split("/").pop()?.split("#").pop() === name,
        )?.predicate;
        if (!fullPredicate) continue;

        if (typeof value === "string") {
          if (name !== "img" && name !== "file") {
            updatedThing = setStringNoLocale(
              updatedThing,
              fullPredicate,
              value,
            );
          }
        }
      }

      console.log(resourceUrl, "res url", dataset, updatedThing, "updated");
      await saveSolidDatasetAt(resourceUrl, setThing(dataset, updatedThing), {
        fetch,
      });
      setMessage("Resource Saved!");
      // setStatus("ok");
      setThingState(updatedThing);
      // if (onSave) onSave();
    } catch (err) {
      setMessage("Error saving Resource");
      // setStatus("error");
      console.error("Error saving dataset:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 col-span-12"
    >
      {fields.map((f) => {
        const fieldName = f.predicate.split("/").pop()?.split("#").pop();
        {
          /*console.log(f, "fields");*/
        }
        switch (fieldName) {
          case "img":
          case "file":
            return (
              <div
                key={f.predicate}
                className="flex flex-col gap-2 border border-border p-3"
              >
                <label className="font-medium capitalize">{fieldName}:</label>
                {renderFilePreview(f.predicate)}
                <FileInputUpload
                  label={
                    fieldName === "img"
                      ? f.value
                        ? "Replace Image"
                        : "Add Image"
                      : f.value
                        ? "Replace Document (.pdf, .doc, .docx, .txt)"
                        : "Add Document (.pdf, .doc, .docx, .txt)"
                  }
                  accept={
                    fieldName === "img" ? "image/*" : ".pdf,.doc,.docx,.txt"
                  }
                  podRoot={podRoot}
                  subDir="archive/uploads/"
                  visibility={true} // or from your state
                  onFileUploaded={(uploadedUrl) => {
                    const updatedThing = setUrl(
                      thing,
                      f.predicate,
                      uploadedUrl,
                    );
                    setThingState(updatedThing);

                    handleChange(f.predicate, uploadedUrl);
                  }}
                />
              </div>
            );
          case "description":
            return (
              <div key={f.predicate} className="flex flex-col">
                <label className="font-medium capitalize">{fieldName}:</label>
                <textarea
                  name={fieldName}
                  maxLength={500}
                  className="border px-1 rounded w-full border-border"
                  value={f.value}
                  onChange={(e) => handleChange(f.predicate, e.target.value)}
                />
              </div>
            );
            {
              /*          case "visibility":
            return (
              <label className="flex w-full gap-x-1 items-baseline">
                Permission Currently:{" "}
                {visibility === "public" ? (
                  <span className="text-green-500">Public</span>
                ) : (
                  <span className="text-red-500">Private</span>
                )}{" "}
                {!visibility && "Check box to set to Public:"}
                <input
                  className="border-border px-1 text-black inline"
                  type="checkbox"
                  checked={visibility === "public"}
                  onChange={() =>
                    setVisibility((prev) =>
                      prev === "public" ? "private" : "public",
                    )
                  }
                />
              </label>
            );*/
            }
          case "visibility":
          case "date":
          case "allowAnnotations":
            return null;
          case "date":
            return (
              <div
                key={f.predicate}
                className="flex flex-col border border-border p-3"
              >
                <label className="font-medium capitalize">
                  Creation {fieldName}:
                </label>
                <input
                  type="date"
                  name={fieldName}
                  className="border px-1 rounded w-full border-border"
                  value={f.value}
                  onChange={(e) => handleChange(f.predicate, e.target.value)}
                />
              </div>
            );
          default:
            return (
              <div key={f.predicate} className="flex flex-col">
                <label className="font-medium capitalize">{fieldName}:</label>
                <input
                  name={fieldName}
                  className="border px-1 rounded w-full border-border"
                  value={f.value}
                  onChange={(e) => handleChange(f.predicate, e.target.value)}
                />
              </div>
            );
        }
      })}
      <button
        type="submit"
        className="rounded w-[100px] mb-2 py-1 bg-background-solidpod text-white capitalize hover:bg-gray-350 cursor-pointer"
      >
        {processing ? "Saving..." : "Submit"}
      </button>{" "}
      {message && (
        <MessageModal message={message} onClose={() => setMessage("")} />
      )}
    </form>
  );
};

export default EditFileForm;
