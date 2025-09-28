"use client";
import { FC, useEffect, useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import { loadResources } from "@/app/solid/loadResources";
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
  console.log(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate-archive`,
    "ologi",
  );

  const ARCHIVE_FOLDER = webId
    ? webId.replace("profile/card#me", "") + "archive/"
    : null;

  useEffect(() => {
    if (!isLoggedIn || !webId || !ARCHIVE_FOLDER) return;

    const load = async () => {
      setLoading(true);
      try {
        const results = await loadResources(ARCHIVE_FOLDER, session.fetch);
        setCategories(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isLoggedIn, webId, ARCHIVE_FOLDER, session.fetch]);

  const handleDelete = async (resourceUrl: string, categoryName: string) => {
    if (!session) return;
    await deleteSolidDataset(resourceUrl, { fetch: session.fetch });
    console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate-archive`);

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
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate-archive`, {
      method: "POST",
    }).catch(console.error);
  };
  if (!isLoggedIn) return <p>Loading...</p>;
  return (
    <div>
      {loading ? <p>Loading...</p> : null}
      {categories && !categories[0] && <p>Currently no resources found ...</p>}

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
