"use client";
import { FC, useEffect, useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import {
  getSolidDataset,
  getContainedResourceUrlAll,
  deleteSolidDataset,
} from "@inrupt/solid-client";
import EditFileForm from "./EditFileForm";
const Archive: FC = () => {
  const { isLoggedIn, session, webId } = useSolidSession();
  const [resources, setResources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const ARCHIVE_FOLDER = webId
    ? webId.replace("profile/card#me", "") + "archive/"
    : null;

  useEffect(() => {
    if (!isLoggedIn || !webId || !ARCHIVE_FOLDER) return;

    const loadResources = async () => {
      try {
        const dataset = await getSolidDataset(ARCHIVE_FOLDER, {
          fetch: session.fetch,
        });
        setData(dataset);
        const urls = getContainedResourceUrlAll(dataset);
        setResources(urls);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [isLoggedIn, webId, ARCHIVE_FOLDER, session.fetch]);

  const handleDelete = async (resourceUrl: string) => {
    if (!session) return;
    await deleteSolidDataset(resourceUrl, { fetch: session.fetch });
    setResources((prev) => prev.filter((r) => r !== resourceUrl));
  };

  console.log("archive");
  if (!isLoggedIn) return <p>Loading...</p>;
  return (
    <div>
      <h2>My Archive</h2>
      {loading ? <p>Loading...</p> : null}
      <ul className="flex flex-col gap-2">
        {resources.map((res) => (
          <li
            key={res}
            className="flex flex-col border p-2 rounded-md bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span>{decodeURIComponent(res.split("/").pop() || "")}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(editing === res ? null : res)}
                  className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
                >
                  {editing === res ? "Close" : "Edit"}
                </button>
                <button
                  onClick={() => handleDelete(res)}
                  className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Show the editor if this resource is being edited */}
            {editing === res && session && (
              <div className="mt-2">
                <EditFileForm
                  resourceUrl={res}
                  fetch={session.fetch}
                  dataset={data}
                  onSave={() => {
                    setEditing(null);
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Archive;
