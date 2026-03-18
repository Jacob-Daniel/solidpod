"use client";
import { useState } from "react";
import { ComponentType, ReactNode } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import { Category } from "@/lib/types";

export interface EditingResource {
  resourceUrl: string;
  thingUrl: string;
  fileName: string;
}

interface TabComponentProps {
  welcome?: ReactNode;
  profile: ComponentType;
  archive: ComponentType<{ onEdit: (resource: EditingResource) => void }>;
  newarchive: ComponentType<{ cats: Category[] }>;
  editResource: ComponentType<{
    resource: EditingResource;
    onBack: () => void;
  }>;
  categories?: Category[] | undefined;
}

export default function TabComponent({
  welcome,
  profile: Profile,
  archive: Archive,
  newarchive: NewArchive,
  editResource: EditResource,
  categories,
}: TabComponentProps) {
  const { isLoggedIn, fullName } = useSolidSession();
  const [activeTab, setActiveTab] = useState<
    "welcome" | "profile" | "archive" | "new-archive"
  >("welcome");
  const [editingResource, setEditingResource] =
    useState<EditingResource | null>(null);

  if (!isLoggedIn) {
    return <p className="w-100">Requires login...</p>;
  }

  const handleTabChange = (tab: any) => {
    setEditingResource(null);
    setActiveTab(tab);
  };

  const handleEdit = (resource: EditingResource) => {
    setEditingResource(resource);
  };

  const handleBackFromEdit = () => {
    setEditingResource(null);
    // stays on archive tab
  };

  return (
    <div className="grid grid-cols-12 gap-x-7 col-span-12">
      <div className="border-border md:rounded md:p-5 flex-1 col-span-12 md:col-span-9 grid-cols-12">
        {editingResource ? (
          <EditResource
            resource={editingResource}
            onBack={handleBackFromEdit}
          />
        ) : (
          <>
            {activeTab === "welcome" && welcome}
            {activeTab === "profile" && <Profile />}
            {activeTab === "archive" && <Archive onEdit={handleEdit} />}
            {activeTab === "new-archive" && (
              <NewArchive cats={categories ?? []} />
            )}
          </>
        )}
      </div>
      <aside className="hidden md:flex-1 md:flex md:flex-col md:col-span-3 border p-3 rounded border-border bg-gray-100 shadow relative border-border text-primary">
        <h2 className="text-sm mb-2 font-bold">{fullName}'s Dashboard</h2>
        <ul className="text-sm">
          {["welcome", "profile", "archive", "new-archive"].map((tab, i) => (
            <li key={i} className="flex items-baseline relative mb-1">
              <button
                key={tab}
                onClick={() => handleTabChange(tab as any)}
                className={`cursor-pointer mb-0 ${
                  activeTab === tab &&
                  !editingResource &&
                  "before:content-['•'] before:absolute before:top-[-6px] before:left-0 before:text-red-500 before:text-lg text-gray-600 ps-2"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
