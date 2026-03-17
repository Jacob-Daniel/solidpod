"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSolidDataset } from "@inrupt/solid-client";
import EditFileForm from "@/app/solid/EditFileForm";
import { useSolidSession } from "@/lib/sessionContext";
import { useRouter } from "next/navigation";

export default function ResourcePage() {
  const params = useSearchParams();
  const { session, fullName } = useSolidSession();
  const router = useRouter();
  const serverUrl = params.get("serverUrl");
  const podName = params.get("podName");
  const archiveDir = params.get("archiveDir");
  const fileName = params.get("fileName");
  const [dataset, setDataset] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "" | "profile" | "archive" | "new-archive"
  >("");
  const resourceUrl = `${serverUrl}/${podName}/archive/${archiveDir}/${fileName}`;

  if (!fileName)
    return (
      <main className="grid grid-cols-12 gap-y-5 md:gap-y-10 min-h-[600px]">
        <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 md:gap-x-7">
          {" "}
          <h1 className="text-xl font-bold mb-4">No Resource Found</h1>
        </div>
      </main>
    );
  const thingUrl = `${resourceUrl}#${fileName.replace(/\.ttl$/, "")}`;

  useEffect(() => {
    if (!resourceUrl) return;

    const loadDataset = async () => {
      try {
        const ds = await getSolidDataset(resourceUrl, { fetch: session.fetch });
        setDataset(ds);
      } catch (err) {
        console.error("Error loading dataset:", err);
      }
    };

    loadDataset();
  }, [resourceUrl, session]);

  useEffect(() => {
    if (!activeTab) return;
    router.push(`/dashboard#${activeTab}`);
  }, [activeTab]);

  if (!dataset)
    return (
      <main className="grid grid-cols-12 gap-y-5 md:gap-y-10 min-h-[600px]">
        <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 md:gap-x-7">
          <h1 className="text-xl font-bold mb-4 col-span-12">
            No Resource Found
          </h1>
        </div>
      </main>
    );
  return (
    <main className="grid grid-cols-12 gap-y-5 md:gap-y-10 min-h-[600px]">
      <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 md:gap-x-7">
        {/*        <TabComponent
          welcome={Intro}
          profile={Profile}
          archive={Archive}
          newarchive={NewArchive}
          categories={cats}
        />*/}
        <section className="border border-border md:rounded md:p-5 flex-1 col-span-12 md:col-span-9 grid-cols-12">
          <h1 className="text-xl font-bold mb-4">Edit {fileName}</h1>
          <EditFileForm
            dataset={dataset}
            resourceUrl={resourceUrl}
            thingUrl={thingUrl}
            fetch={session.fetch}
          />
        </section>
        <aside className="hidden md:flex-1 md:flex md:flex-col md:col-span-3 border p-3 rounded border-border bg-gray-100 shadow relative border-border text-primary">
          <h2 className="text-sm mb-2 font-bold">{fullName}'s Dashboard </h2>
          <ul className="text-sm">
            {["welcome", "profile", "archive", "new-archive"].map((tab, i) => (
              <li key={i} className="flex items-baseline relative mb-1">
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`cursor-pointer mb-0 ${activeTab === tab && "before:content-['•'] before:absolute before:absolute before:top-[-6px] before:left-0 before:text-red-500 before:text-lg text-gray-600 ps-2"}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
