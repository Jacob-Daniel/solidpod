import { getAPI } from "@/lib/functions";
import RichContentRenderer from "@/app/components/RichPageContentRender";
import Profile from "@/app/solid/Profile";
import Archive from "@/app/solid/Archive";
import NewArchive from "@/app/solid/CreateResourceForm";
import TabComponent from "./TabComponent";
import { Page } from "@/lib/types";

async function fetchPage() {
  return getAPI<Page[]>(
    `/pages?filters[slug][$eq]=dashboard&populate[sections][on][content.content][populate]=*&populate[sidebar][on][layout.sidebar][populate]=*&populate[sidebar][on][layout.navigation][populate][navigation_menu][populate]=*`,
  );
}

export default async function Intro() {
  const [data] = await fetchPage();
  const Intro =
    data &&
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
              <RichContentRenderer blocks={section.content} className="" />
            </section>
          );

        default:
          console.warn("Unknown section type:", section.__component);
          return null;
      }
    });

  return (
    <main className="grid grid-cols-12 gap-y-5 md:gap-y-10">
      <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 md:gap-x-7 scroll-mt-24 md:pb-[250px]">
        <div className="col-span-12">
          <TabComponent
            intro={Intro}
            profile={Profile}
            archive={Archive}
            newarchive={NewArchive}
          />
        </div>
      </div>
    </main>
  );
}
