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
// import SectionTabs from "@/app/components/SectionTabs";

import {
  InfoCard,
  Page,
  Event,
  InfoCardSection,
  FeaturedSection,
  FeaturedEventSection,
  PlacesSection,
  SharedSEO,
  Petition,
} from "@/lib/types";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import H2 from "@/app/components/H2";

export default async function Resources() {
  const [[data]] = await Promise.all([
    getAPI<Page[]>("/pages?filters[slug][$eq]=resources&populate=*"),
  ]);
  console.log(data);
  if (!data)
    return (
      <div>
        <p className="text-black">No content available</p>
      </div>
    );
  return (
    <main className="grid grid-cols-12 gap-y-10">
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12 px-5 lg:px-0">
        {data &&
          data.sections instanceof Array &&
          data.sections.map((section, index) => {
            switch (section.__component) {
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

              default:
                console.warn("Unknown section type:", section.__component);
                return null;
            }
          })}
      </div>
    </main>
  );
}
