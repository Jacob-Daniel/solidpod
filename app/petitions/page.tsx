import { ReactNode } from "react";
import { getAPI } from "@/lib/functions";
import FeaturedPetitions from "@/app/components/FeaturedPetitions";
import BannerTop from "@/app/components/BannerTop";

import {
  Page,
  Event,
  FeaturedSection,
  PlacesSection,
  SharedSEO,
  Petition,
} from "@/lib/types";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import H2 from "@/app/components/H2";

export default async function Petitions() {
  const [featured, [data]] = await Promise.all([
    getAPI<Petition[]>("/featured-petitions"),
    getAPI<Page[]>(
      "/pages?filters[slug][$eq]=petitions&populate[banner][populate][image_versions][populate]=image&populate[sections][on][layout.featured][populate]=*&populate[sections][on][content.content][populate]=*",
    ),
  ]);

  if (!data) return <div>No content available</div>;
  // console.log(data, "section");
  return (
    <main className="grid grid-cols-12 gap-y-10">
      <div className="col-span-12 md:col-span-10 md:col-start-2 grid grid-cols-12">
        {data.banner && <BannerTop banner={data.banner} />}
      </div>
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
                      className="w-full lg:text-xl"
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
                      <FeaturedPetitions
                        featured={featured}
                        section={section}
                        view={3}
                        gap={30}
                      />
                    </Frame>
                  </div>
                );

              default:
                console.warn("Unknown section type:", section.__component);
                return null;
            }
          })}
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
    <div className="relative col-span-12 grid grid-cols-12 lg:px-0 px-5 md:px-0">
      <header className="col-span-12 flex flex-col">
        <H2
          child={section.heading}
          className="text-lg md:text-xl lg:text-2xl leading-none font-bold font-sans mb-2"
        />
        <RichPageContentRender
          blocks={section.content}
          className="w-full lg:text-xl"
        />
      </header>
      <div className="col-span-12 flex flex-col md:flex-row gap-y-5 lg:px-0 md:gap-x-5">
        {children}
      </div>
    </div>
  );
}
