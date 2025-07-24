import { ReactNode } from "react";
import { getAPI } from "@/lib/functions";
import UlPageContent from "@/app/components/UlPageContent";
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
async function fetchPage() {
  return getAPI<Page[]>(
    `/pages?filters[slug][$eq]=user-guide&populate[banner][populate][image_versions][populate]=image&populate[sections][on][content.content][populate]=*&populate[sidebar][on][layout.sidebar][populate]=*&populate[sidebar][on][layout.navigation][populate][navigation_menu][populate]=*`,
  );
}

export default async function UserGuide() {
  const [data] = await fetchPage();
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
      <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 lg:gap-x-10 scroll-mt-24 pb-[250px]">
        <div className="border border-gray-200 rounded p-5 flex-1 col-span-12 md:col-span-9 grid-cols-12">
          {data &&
            data.sections instanceof Array &&
            data.sections.map((section, index) => {
              switch (section.__component) {
                case "content.content":
                  return (
                    <section
                      id={section.anchor}
                      key={`p-${index}`}
                      className="relative col-span-12 pb-5 mb-10 scroll-mt-20"
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
        <aside className="flex-1 col-span-12 md:col-span-3 flex flex-col gap-y-7 border p-3 rounded border-gray-200 bg-gray-100 shadow relative">
          {data &&
            data.sidebar instanceof Array &&
            data.sidebar.map((block, index: number) => {
              switch (block.__component) {
                case "layout.navigation":
                  return (
                    <div key={index} className="sticky absolute top-3">
                      <h3 className="text-sm mb-1 font-semibold">
                        On this page
                      </h3>
                      <UlPageContent
                        menu={block}
                        type="sidebar"
                        className="text-sm overflow-y-auto max-h-[30vh] thin-scrollbar"
                        classNameLi="pb-1 !leading-none"
                        page="user-guide"
                      />
                    </div>
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
