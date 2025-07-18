import { ReactNode } from "react";
import { getAPI } from "@/lib/functions";
import UL from "@/app/components/UL";
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

import { Page } from "@/lib/types";
// import RichPageContentRender from "@/app/components/RichPageContentRender";
// import H2 from "@/app/components/H2";

export default async function Resources() {
  const [[data]] = await Promise.all([
    getAPI<Page[]>(
      `/pages?filters[slug][$eq]=resources&populate[banner][populate][image_versions][populate]=image&populate[sections][on][content.content][populate]=*&populate[sidebar][on][layout.sidebar][populate]=*&populate[sidebar][on][layout.navigation][populate][navigation_menu][populate]=*`,
    ),
  ]);
  if (!data)
    return (
      <div>
        <p className="text-black">No content available</p>
      </div>
    );
  return (
    <main className="grid grid-cols-12 gap-y-10">
      {data.banner && data.banner.image_versions[0].image.url && (
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12">
          <BannerTop banner={data.banner} />
        </div>
      )}
      <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 md:gap-x-10">
        <div className="col-span-12 md:col-span-9 grid-cols-12">
          {data &&
            data.sections instanceof Array &&
            data.sections.map((section, index) => {
              switch (section.__component) {
                case "content.content":
                  return (
                    <section
                      id={section.anchor}
                      key={`p-${index}`}
                      className="relative col-span-12 pb-5"
                    >
                      <RichContentRenderer
                        blocks={section.content}
                        className=""
                      />
                    </section>
                  );

                default:
                  console.warn("Unknown section type:", section.__component);
                  return null;
              }
            })}
        </div>
        <aside className="col-span-12 md:col-span-3 flex flex-col gap-y-7 border p-3 rounded border-gray-200 bg-gray-100 shadow relative">
          {data &&
            data.sidebar instanceof Array &&
            data.sidebar.map((block, index: number) => {
              switch (block.__component) {
                case "layout.navigation":
                  return (
                    <UL
                      key={index}
                      menu={block}
                      type="sidebar"
                      className="mb-5 text-sm sticky absolute top-3"
                      classNameLi="pb-0 !leading-none"
                      page="resources"
                    />
                  );
                case "content.heading":
                  return <h2 key="heading">{block.heading}</h2>;

                default:
                  console.warn("Unknown section type:", "");
                  return null;
              }
            })}
        </aside>
      </div>
    </main>
  );
}
