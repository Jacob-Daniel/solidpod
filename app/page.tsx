import { ReactNode } from "react";
import { getAPI } from "@/lib/functions";
import FeaturedPetitions from "@/app/components/FeaturedPetitions";
import IntroCards from "@/app/components/IntroCards";
import BannerTop from "@/app/components/BannerTop";
import RichContentRenderer from "@/app/components/RichPageContentRender";

// import BannerTop from "@/app/components/BannerTop";
// import VolunteerIntro from "@/app/components/VolunteerIntro";
// import PlaceSwiper from "@/app/components/PlaceSwiperWrapper";
// const VolunteerIntro = dynamic(
//   () => import("@/app/components/VolunteerIntro"),
//   {
//     loading: () => (
//       <section className="grid grid-cols-12 col-span-12 md:gap-x-0 bg-white mb-16 bg-gray-400">
//         Loading VolunteerIntro...
//       </section>
//     ),
//   },
// );
// const PlaceSwiper = dynamic(() => import("@/app/components/PlaceSwiper"), {
//   loading: () => (
//     <section className="w-full gap-y-0 relative bg-gray-400">
//       Loading Places...
//     </section>
//   ),
// });

import {
  InfoCard,
  Page,
  // Event,
  // InfoCardSection,
  // FeaturedSection,
  // FeaturedEventSection,
  // PlacesSection,
  // SharedSEO,
  Petition,
} from "@/lib/types";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import H2 from "@/app/components/H2";

async function fetchFeaturedPeitions() {
  return getAPI<Petition[]>("/featured-petitions");
}

async function fetchHomePage() {
  return getAPI<Page[]>(
    "/pages?filters[slug][$eq]=home&populate[banner][populate][image_versions][populate]=image&populate[sections][on][layout.featured][populate]=*&populate[sections][on][content.content][populate]=*&populate[sections][on][layout.info-card-section][populate]=*",
  );
}

export default async function Home() {
  const [[data], featured] = await Promise.all([
    fetchHomePage(),
    fetchFeaturedPeitions(),
  ]);

  if (!data) return <div>No content available</div>;
  return (
    <main className="grid grid-cols-12 gap-y-10">
      {data.banner && data.banner.image_versions[0].image && (
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12">
          <BannerTop banner={data.banner} />
        </div>
      )}
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12 px-5 lg:px-0">
        {data &&
          data.sections instanceof Array &&
          data.sections.map((section, index) => {
            switch (section.__component) {
              case "layout.info-card-section":
                return (
                  <div
                    key="info_card"
                    className="col-span-12 grid grid-cols-12 mb-16 gap-y-5 md:gap-x-5"
                  >
                    {section &&
                      section.info_card instanceof Array &&
                      section.info_card.map((card: InfoCard, id: number) => (
                        <IntroCards
                          key={id}
                          json={card} // Pass the array of IconTabContent
                          id={`tab${index}`}
                          pagination="swiper-pagination-use"
                          route=""
                          path=""
                          icon_colour="!text-black"
                        />
                      ))}
                  </div>
                );
              case "content.content":
                return (
                  <div
                    key={`p-${index}`}
                    className="relative col-span-12 grid grid-cols-12 pb-5"
                  >
                    {" "}
                    <div className="col-span-12">
                      <RichContentRenderer
                        blocks={section.content}
                        className=""
                      />
                    </div>
                  </div>
                );
              case "layout.featured":
                return (
                  <Frame key={index}>
                    <FeaturedPetitions
                      featured={featured}
                      section={section}
                      view={1}
                      gap={0}
                    />
                  </Frame>
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
function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-12  mb-5 gap-y-5 lg:px-0 ">
      <h2 className="font-sans font-bold mb-3 text-md md:text-lg lg:text-2xl">
        Petitions
      </h2>
      <div className="relative col-span-12 grid grid-cols-12 gap-y-5 md:gap-x-5">
        {children}
      </div>
    </div>
  );
}
