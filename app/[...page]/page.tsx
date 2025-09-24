import { getAPI } from "@/lib/functions";
import UlPageContentAnchors from "@/app/components/UlPageContentAnchors";
import BannerTop from "@/app/components/BannerTop";
import RichContentRenderer from "@/app/components/RichPageContentRender";
type Tags = {
  label: string;
  target: string;
  fragment: string;
};

import { Page } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function DynamicPage({
  params,
}: {
  params: { page?: string[] };
}) {
  let { page } = params;
  let blurDataUrl;
  const [[data]] = await Promise.all([
    getAPI<Page[]>(
      `/pages?filters[slug][$eq]=${page}&populate[banner][populate][image_versions][populate]=image&populate[sections][on][layout.featured][populate]=*&populate[sidebar][on][layout.sidebar][populate]=*&populate[sections][on][content.content][populate]=*&populate[sections][on][layout.info-card-section][populate]=*`,
    ),
  ]);
  if (!data) notFound();
  const tags: Tags[] =
    data?.sections
      ?.filter((section) => section.__component === "content.content")
      ?.map((section) => ({
        fragment: section?.anchor as string,
        label: section?.anchor as string,
        target: "_self",
      })) ?? [];
  if (data.banner) {
    const img =
      data?.banner?.image_versions.find((v) => v.version === "desktop")
        ?.image ?? data?.banner?.image_versions[0]?.image;

    blurDataUrl = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${img?.formats.thumbnail.url}`,
    )
      .then((res) => res.arrayBuffer())
      .then(
        (buf) =>
          `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`,
      );
  }

  return (
    <main className="grid grid-cols-12 gap-y-10">
      {data.banner && blurDataUrl && data.banner.image_versions[0].image && (
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12">
          <BannerTop banner={data.banner} blurDataUrl={blurDataUrl as string} />
        </div>
      )}
      <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 md:gap-x-7 scroll-mt-24 mb-16">
        <div className="md:border md:border-gray-200 dark:border-zinc-800 md:rounded md:p-5 flex-1 col-span-12 md:col-span-9 grid-cols-12">
          {data &&
            data.sections instanceof Array &&
            data.sections.map((section, index) => {
              switch (section.__component) {
                case "content.content":
                  return (
                    <section
                      id={section.anchor}
                      key={`p-${index}`}
                      className="relative col-span-12 mb-7 scroll-mt-20"
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
        <aside className="hidden md:flex-1 md:flex md:flex-col md:col-span-3 gap-y-7 border p-3 rounded border-gray-200 dark:border-zinc-800 bg-gray-100 shadow relative dark:bg-inherit dark:text-white">
          {" "}
          {data &&
            data.sidebar instanceof Array &&
            data.sidebar.map((block, index: number) => {
              switch (block.__component) {
                case "layout.sidebar":
                  return (
                    <div key={index} className="sticky absolute top-3 text-sm">
                      {block && block.heading && (
                        <p className="mb-2 font-bold">{block.heading}</p>
                      )}
                      <UlPageContentAnchors
                        list={tags}
                        type="sidebar"
                        className="text-sm overflow-y-auto max-h-[30vh] thin-scrollbar text-slate-800 dark:text-white"
                        classNameLi="pb-1 !leading-none"
                        page="introduction"
                      />
                    </div>
                  );
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
