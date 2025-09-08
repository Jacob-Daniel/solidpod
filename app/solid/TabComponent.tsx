"use client";

import { useState } from "react";
import { ComponentType, ReactNode } from "react";

interface TabComponentProps {
  welcome: ReactNode;
  profile: ComponentType;
  archive: ComponentType;
  newarchive: ComponentType;
}

export default function TabComponent({
  welcome,
  profile: Profile,
  archive: Archive,
  newarchive: NewArchive,
}: TabComponentProps) {
  const [activeTab, setActiveTab] = useState<
    "welcome" | "profile" | "archive" | "newarchive"
  >("welcome");

  return (
    <div className="grid grid-cols-12 gap-x-7 col-span-12">
      <div className="md:border md:border-gray-200 dark:border-zinc-800 md:rounded md:p-5 flex-1 col-span-12 md:col-span-9 grid-cols-12">
        {activeTab === "welcome" && welcome}
        {activeTab === "profile" && <Profile />}
        {activeTab === "archive" && <Archive />}
        {activeTab === "newarchive" && <NewArchive />}
      </div>
      <aside className="hidden md:flex-1 md:flex md:flex-col md:col-span-3 gap-y-7 border p-3 rounded border-gray-200 dark:border-zinc-800 bg-gray-100 shadow relative dark:bg-inherit dark:text-white">
        <ul className="text-sm">
          {["welcome", "profile", "archive", "newarchive"].map((tab, i) => (
            <li key={i} className="flex items-baseline relative">
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`cursor-pointer mb-0 ${activeTab === tab && "before:content-['•'] before:absolute before:absolute before:top-[-6px] before:left-0 before:text-red-500 before:text-lg text-gray-600 ps-2"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
