import { ReactNode } from "react";
import { getAPI } from "@/lib/functions";
import FeaturedPetitions from "@/app/components/FeaturedPetitions";
import IntroCards from "@/app/components/IntroCards";
import BannerTop from "@/app/components/BannerTop";
import TagList from "@/app/components/TagList";
import RichContentRenderer from "@/app/components/RichPageContentRender";
import { InfoCard, Page, Petition, Tags } from "@/lib/types";

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

async function fetchFeaturedPeitions() {
  return getAPI<Petition[]>("/featured-petitions");
}

async function fetchTags() {
  return getAPI<Tags[]>("/tags");
}

async function fetchHomePage() {
  return getAPI<Page[]>(
    "/pages?filters[slug][$eq]=home&populate[banner][populate][image_versions][populate]=image&populate[sections][on][layout.featured][populate]=*&populate[sections][on][content.heading][populate]=*&populate[sections][on][layout.info-card-section][populate]=*",
  );
}

export default async function Home() {
  const [[data], featured, tags] = await Promise.all([
    fetchHomePage(),
    fetchFeaturedPeitions(),
    fetchTags(),
  ]);
  if (!data) return <div>No content available</div>;

  const blurDataUrl = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data?.banner?.image_versions[1].image.formats.thumbnail.url}`,
  )
    .then((res) => res.arrayBuffer())
    .then(
      (buf) => `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`,
    );
  return (
    <main className="grid grid-cols-12 gap-y-10">
      {data.banner && data.banner.image_versions[0].image && (
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12">
          <BannerTop banner={data.banner} blurDataUrl={blurDataUrl as string} />
        </div>
      )}
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12 px-5 lg:px-0">
        {data &&
          data.sections instanceof Array &&
          data.sections.map((section, index) => {
            switch (section.__component) {
              case "layout.info-card-section":
                return (
                  <section
                    key="info_card"
                    className="col-span-12 md:grid md:grid-cols-12 mb-16 flex gap-y-5 gap-x-5 overflow-x-auto whitespace-nowrap max-w-full"
                  >
                    {section &&
                      section.info_card instanceof Array &&
                      section.info_card.map((card: InfoCard, id: number) => (
                        <IntroCards
                          key={id}
                          json={card}
                          id={`tab${id}`}
                          pagination="swiper-pagination-use"
                          route=""
                          path=""
                          icon_colour="!text-black"
                        />
                      ))}
                  </section>
                );
              case "content.content":
                return (
                  <section
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
                  </section>
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
              case "content.heading":
                return <TagList key={index} tags={tags} />;

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
    <section className="col-span-12  mb-5 gap-y-5 lg:px-0 mb-16">
      {/*      <h2 className="font-sans font-bold mb-3 text-md md:text-lg lg:text-2xl">
        Petitions
      </h2>*/}
      <div className="relative col-span-12 grid grid-cols-12 gap-y-5 md:gap-x-5">
        {children}
      </div>
    </section>
  );
}
