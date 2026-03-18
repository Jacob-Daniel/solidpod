"use client";
import { FC, useEffect, useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import { loadResources } from "@/app/solid/loadResources";
import { deleteSolidDataset } from "@inrupt/solid-client";
import ArchiveList from "@/app/solid/ArchiveList";
import type { EditingResource } from "@/app/solid/TabComponent";

interface ArchiveCategory {
  name: string;
  resources: string[];
}

interface Props {
  onEdit: (resource: EditingResource) => void;
}

const Archive: FC<Props> = ({ onEdit }) => {
  const { isLoggedIn, session, webId } = useSolidSession();
  const [categories, setCategories] = useState<ArchiveCategory[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }
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
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate-archive`, {
      method: "POST",
    }).catch(console.error);
  };
  if (!isLoggedIn) return <p>Loading...</p>;
  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {categories && !categories[0] && <p>Currently no resources found ...</p>}

      {categories
        .filter((c) => c.resources[0])
        .map((cat) => (
          <section key={cat.name} className="mb-7">
            <header className="flex">
              <h3 className="font-semibold capitalize mb-3">
                {cat.name}:{" "}
                <span className="font-normal lowercase">
                  {cat.resources.length}
                </span>
              </h3>
            </header>
            <ArchiveList
              resources={cat.resources}
              fetch={session.fetch}
              onDelete={(url) => handleDelete(url, cat.name)}
              onEdit={onEdit}
            />
          </section>
        ))}
    </>
  );
};

export default Archive;
