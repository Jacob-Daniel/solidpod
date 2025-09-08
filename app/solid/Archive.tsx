"use client";
import { FC, useEffect, useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import {
  getSolidDataset,
  getContainedResourceUrlAll,
  deleteSolidDataset,
} from "@inrupt/solid-client";
import ArchiveList from "@/app/solid/ArchiveList";

interface ArchiveCategory {
  name: string;
  resources: string[];
}

const Archive: FC = () => {
  const { isLoggedIn, session, webId } = useSolidSession();
  const [categories, setCategories] = useState<ArchiveCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const ARCHIVE_FOLDER = webId
    ? webId.replace("profile/card#me", "") + "archive/"
    : null;

  useEffect(() => {
    if (!isLoggedIn || !webId || !ARCHIVE_FOLDER) return;

    const loadResources = async () => {
      try {
        // Get the main archive folder
        const dataset = await getSolidDataset(ARCHIVE_FOLDER, {
          fetch: session.fetch,
        });

        // Find category subfolders
        const contained = getContainedResourceUrlAll(dataset);
        const categoryUrls = contained.filter((url) => url.endsWith("/"));

        const results: ArchiveCategory[] = [];

        for (const catUrl of categoryUrls) {
          try {
            const catDataset = await getSolidDataset(catUrl, {
              fetch: session.fetch,
            });
            const catResources = getContainedResourceUrlAll(catDataset);

            results.push({
              name: catUrl.replace(ARCHIVE_FOLDER, "").replace(/\/$/, ""), // e.g. "media"
              resources: catResources,
            });
          } catch (err) {
            console.warn("Could not load category:", catUrl, err);
          }
        }

        setCategories(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [isLoggedIn, webId, ARCHIVE_FOLDER, session.fetch]);

  const handleDelete = async (resourceUrl: string, categoryName: string) => {
    if (!session) return;
    await deleteSolidDataset(resourceUrl, { fetch: session.fetch });

    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? {
              ...cat,
              resources: cat.resources.filter((r) => r !== resourceUrl),
            }
          : cat,
      ),
    );
  };

  if (!isLoggedIn) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-2">Archive</h2>
      {loading ? <p>Loading...</p> : null}

      {categories.map((cat) => (
        <div key={cat.name} className="mb-6">
          <h3 className="font-semibold capitalize">{cat.name}</h3>
          <ArchiveList
            resources={cat.resources}
            fetch={session.fetch}
            onDelete={(url) => handleDelete(url, cat.name)}
          />
        </div>
      ))}
    </div>
  );
};

export default Archive;
