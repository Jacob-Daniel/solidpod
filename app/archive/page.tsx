import { ReactNode, Suspense } from "react";
import { getAPI, getPAPI } from "@/lib/functions";
import { buildCategoryResources } from "@/lib/getCategoryResources";
import FeaturedSwiper from "@/app/components/FeaturedSwiper";
import BannerTop from "@/app/components/BannerTop";
import ArchiveCategoryTabs from "@/app/solid/ArchiveCatTabs";

import { Page, Category } from "@/lib/types";
import RichPageContentRender from "@/app/components/RichPageContentRender";

export default async function Archive() {
  const [featured, [data], archives] = await Promise.all([
    getAPI<Category[]>("/categories?populate=*"),
    getAPI<Page[]>(
      "/pages?filters[slug][$eq]=archive&populate[banner][populate][image_versions][populate]=image",
    ),
    getPAPI<{ webId: string }[]>("/archives?populate=*"),
  ]);
  if (!data) return <div>No content available</div>;
  const categories = {
    slugs: featured.map((f) => f.slug),
    images: featured.map((f) => f.image),
  };
  const webIds = archives.data.map((a) => a.webId);

  const categoryResources = await buildCategoryResources(
    webIds,
    categories.slugs,
  );

  return (
    <main className="grid grid-cols-12 gap-y-10">
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12">
        <BannerTop banner={data.banner} />
      </div>
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12 px-5 lg:px-0">
        {data &&
          data.sections instanceof Array &&
          data.sections.map((section, index) => {
            switch (section.__component) {
              case "content.content":
                return (
                  <div key={`a-${index}`} className="relative col-span-12">
                    <RichPageContentRender blocks={section.content} />
                  </div>
                );

              case "layout.featured":
                return (
                  <div
                    key={`p-${index}`}
                    className="relative col-span-12 grid grid-cols-12 pb-20"
                  >
                    <Frame>
                      <FeaturedSwiper featured={featured} section={section} />
                    </Frame>
                  </div>
                );

              default:
                console.warn("Unknown section type:", section.__component);
                return null;
            }
          })}
        <Suspense
          fallback={<div className="col-span-12">Loading categories...</div>}
        >
          <ArchiveCategoryTabs
            categories={featured}
            resources={categoryResources}
          />
        </Suspense>
      </div>
    </main>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative col-span-12 grid grid-cols-12">
      <div className="col-span-12 grid grid-cols-12 md:flex-row gap-y-5 lg:px-0 md:gap-x-5">
        {children}
      </div>
    </div>
  );
}
