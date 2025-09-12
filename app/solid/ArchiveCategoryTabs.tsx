"use client";

import { useState } from "react";
import PublicArchiveList from "@/app/solid/PublicArchiveList";
import { useSearchParams } from "next/navigation";

interface ArchiveCategoryTabsProps {
  categories: string[];
  resources: Record<string, string[]>; // category → list of pod URLs
}

export default function ArchiveCategoryTabs({
  categories,
  resources,
}: ArchiveCategoryTabsProps) {
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat");
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? activeCat || categories[0] : "",
  );

  if (!categories || categories.length === 0) {
    return <p>No categories available.</p>;
  }
  console.log(activeCat);
  const activeResources = resources[activeCategory] || [];

  return (
    <div className="grid grid-cols-12 gap-x-7 col-span-12">
      <div className="md:border md:border-gray-200 dark:border-zinc-800 md:rounded md:p-5 flex-1 col-span-12 md:col-span-9">
        {activeCategory ? (
          <div>
            <h2 className="mb-4 font-semibold capitalize">{activeCategory}</h2>
            <PublicArchiveList resources={activeResources} />
          </div>
        ) : (
          <p>Select a category</p>
        )}
      </div>

      <aside className="hidden md:flex-1 md:flex md:flex-col md:col-span-3 gap-y-7 border p-3 rounded border-gray-200 dark:border-zinc-800 bg-gray-100 shadow relative dark:bg-inherit dark:text-white">
        <ul className="text-sm">
          {categories.map((cat) => (
            <li key={cat} className="flex items-baseline relative mb-1">
              <button
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer mb-0 ${
                  activeCategory === cat &&
                  "before:content-['•'] before:absolute before:top-[-6px] before:left-0 before:text-red-500 before:text-lg text-gray-600 ps-2"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
