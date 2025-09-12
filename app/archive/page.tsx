import { ReactNode } from "react";
import { getAPI, getPAPI } from "@/lib/functions";
import { buildCategoryResources } from "@/lib/getCategoryResources";
import FeaturedSwiper from "@/app/components/FeaturedSwiper";
import BannerTop from "@/app/components/BannerTop";
import ArchiveCategoryTabs from "@/app/solid/ArchiveCategoryTabs";

import { Page, FeaturedSection, PlacesSection, Category } from "@/lib/types";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import { IImage } from "@/lib/dynamicTypes";

export default async function Archive() {
  const [featured, [data], archives] = await Promise.all([
    getAPI<Category[]>("/categories?populate=*"),
    getAPI<Page[]>(
      "/pages?filters[slug][$eq]=archive&populate[banner][populate][image_versions][populate]=image",
    ),
    getPAPI<{ webId: string }[]>("/archives?populate=*"),
  ]);
  // const categoryResources: Record<string, string[]> = {};
  if (!data) return <div>No content available</div>;

  const blurDataUrl = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data?.banner?.image_versions[1].image.formats.thumbnail.url}`,
  )
    .then((res) => res.arrayBuffer())
    .then(
      (buf) => `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`,
    );
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
      {data.banner && (
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12">
          <BannerTop banner={data.banner} blurDataUrl={blurDataUrl} />
        </div>
      )}
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12 px-5 lg:px-0">
        {data &&
          data.sections instanceof Array &&
          data.sections.map((section, index) => {
            switch (section.__component) {
              case "content.content":
                return (
                  <div key={`a-${index}`} className="relative col-span-12">
                    <RichPageContentRender
                      blocks={section.content}
                      className="w-full"
                    />
                  </div>
                );

              case "layout.featured":
                return (
                  <div
                    key={`p-${index}`}
                    className="relative col-span-12 grid grid-cols-12 pb-20"
                  >
                    <Frame section={section}>
                      <FeaturedSwiper
                        featured={featured}
                        section={section}
                        view={-0}
                        gap={0}
                      />
                    </Frame>
                  </div>
                );

              default:
                console.warn("Unknown section type:", section.__component);
                return null;
            }
          })}
        <ArchiveCategoryTabs
          categories={featured}
          resources={categoryResources}
        />
      </div>
    </main>
  );
}

function Frame({
  section,
  children,
}: {
  section: FeaturedSection | PlacesSection;
  children: ReactNode;
}) {
  return (
    <div className="relative col-span-12 grid grid-cols-12">
      {/*      <header className="col-span-12 flex flex-col">
        <H2
          child={section.heading}
          className="text-lg md:text-lg lg:text-2xl leading-none font-bold font-sans mb-2"
        />
      </header>*/}
      <div className="col-span-12 grid grid-cols-12 md:flex-row gap-y-5 lg:px-0 md:gap-x-5">
        {children}
      </div>
    </div>
  );
}
