"use client";
import { useState, useEffect } from "react";
import { getAPI } from "@/lib/functions";
import RichContentRenderer from "@/app/components/RichPageContentRender";
import Profile from "@/app/solid/Profile";
import Archive from "@/app/solid/Archive";
import NewArchive from "@/app/solid/CreateResourceForm";
import TabComponent from "@/app/solid/TabComponent";
import { Page, Category } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useSolidSession } from "@/lib/sessionContext";

async function fetchPage() {
  return getAPI<Page[]>(
    `/pages?filters[slug][$eq]=dashboard&populate[sections][on][content.content][populate]=*&populate[sidebar][on][layout.sidebar][populate]=*&populate[sidebar][on][layout.navigation][populate][navigation_menu][populate]=*`,
  );
}

async function fetchCategory() {
  return getAPI<Category[]>(`/categories`);
}

export default function Dashboard() {
  const { isLoggedIn } = useSolidSession();
  const [data, setData] = useState<Page>();
  const [cats, setCats] = useState<Category[]>();
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!data) {
      const getData = async () => {
        const [[data], cats] = await Promise.all([
          fetchPage(),
          fetchCategory(),
        ]);
        setCats(cats);
        setData(data);
      };
      getData();
    }
  });

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
              className="relative col-span-12"
            >
              <RichContentRenderer blocks={section.content} className="" />
            </section>
          );

        default:
          console.warn("Unknown section type:", section.__component);
          return null;
      }
    });

  console.log(cats, "cat");

  return (
    <main className="grid grid-cols-12 gap-y-5 md:gap-y-10 min-h-[600px]">
      <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 md:gap-x-7">
        <TabComponent
          welcome={Intro}
          profile={Profile}
          archive={Archive}
          newarchive={NewArchive}
          categories={cats}
        />
      </div>
    </main>
  );
}
