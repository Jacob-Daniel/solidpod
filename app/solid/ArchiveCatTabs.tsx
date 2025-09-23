"use client";
import { useState, useEffect } from "react";
import PublicArchiveList from "@/app/solid/PublicArchiveList";
import { useSearchParams } from "next/navigation";
import { Category } from "@/lib/types";
import Image from "next/image";

interface ArchiveCategoryTabsProps {
  categories: Category[];
  resources: Record<string, string[]>;
}

export default function ArchiveCategoryTabs({
  categories,
  resources,
}: ArchiveCategoryTabsProps) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<{
    slug: string;
    name: string;
  }>({
    slug: categories[0]?.slug || "",
    name: categories[0]?.name || "",
  });

  const [activeImage, setActiveImage] = useState<string>(
    categories[0]?.image?.url || "",
  );

  // Use useEffect to handle searchParams on client side only
  useEffect(() => {
    const activeCat = searchParams.get("cat");
    if (activeCat) {
      const foundCategory = categories.find(
        (c) => c.name === activeCat || c.slug === activeCat,
      );
      if (foundCategory) {
        setActiveCategory({
          slug: foundCategory.slug,
          name: foundCategory.name,
        });
        setActiveImage(foundCategory.image?.url || "");
      }
    }
  }, [searchParams, categories]);

  const activeResources = resources[activeCategory.slug] || [];
  const catCount = activeResources.length;

  return (
    <div className="grid grid-cols-12 md:gap-x-7 col-span-12">
      <div className="order-2 md:order-0 col-span-12 md:border md:border-gray-200 dark:border-zinc-800 md:rounded md:p-5 flex-1 col-span-12 md:col-span-9">
        {activeCategory ? (
          <>
            <div className="mb-3 flex items-end gap-x-5 border-b border-gray-300 pb-5">
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${activeImage}`}
                height={50}
                width={50}
                alt={activeCategory.name || "archive category"}
                className=""
              />
              <div className="flex gap-x-2 items-end">
                <h2 className="capitalize border border-gray-300 px-1">
                  <span>Category: </span>
                  {activeCategory.name}
                </h2>
                <span className="border border-gray-300 px-1">
                  Items: {catCount}
                </span>
              </div>
            </div>
            <div>
              <PublicArchiveList resources={activeResources} />
            </div>
          </>
        ) : (
          <p>Select a category</p>
        )}
      </div>

      <aside className="mb-5 flex-1 md:flex md:flex-col col-span-12 md:col-span-3 gap-y-7 border p-3 rounded border-gray-200 md:dark:border-zinc-800 md:bg-gray-100 shadow relative md:dark:bg-inherit md:dark:text-white">
        <ul className="flex text-sm overflow-x-auto whitespace-nowrap max-w-full gap-x-2 md:whitespace-normal md:overflow-hidden md:block">
          {categories.map((cat) => (
            <li
              key={cat.slug}
              className="flex items-baseline relative md:mb-1 gap-x-2 md: md:gap-x-0"
            >
              <button
                onClick={() => {
                  setActiveCategory({ slug: cat.slug, name: cat.name });
                  setActiveImage(cat.image?.url || "");
                }}
                className={`text-base cursor-pointer mb-0 border border-gray-300 rounded md:border-0 ${
                  activeCategory.slug === cat.slug &&
                  "bg-zinc-800 text-white md:bg-inherit md:text-body md:before:content-['•'] md:before:absolute md:before:top-[-6px] md:before:left-0 md:before:text-red-500 md:before:text-lg md:text-gray-600 md:ps-2 md:ml-2"
                }`}
              >
                {cat.slug.charAt(0).toUpperCase() + cat.slug.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
