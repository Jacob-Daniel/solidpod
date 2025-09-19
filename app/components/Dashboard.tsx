"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RichContentRenderer from "@/app/components/RichPageContentRender";
import Profile from "@/app/solid/Profile";
import Archive from "@/app/solid/Archive";
import NewArchive from "@/app/solid/NewArchive";
import TabComponent from "@/app/solid/TabComponent";
import type { Page, Category } from "@/lib/types";
import { useSolidSession } from "@/lib/sessionContext";
import { handleIncomingSolidLogin } from "@/lib/handleIncomingSolidLogin";
import LoginButton from "@/app/solid/LoginButton";
type Props = {
  page: Page;
  cats: Category[];
};

export default function Dashboard({ page, cats }: Props) {
  const { isLoggedIn, session } = useSolidSession();
  const router = useRouter();
  useEffect(() => {
    handleIncomingSolidLogin(session.info);
  }, [session]);

  // useEffect(() => {
  //   if (isLoggedIn === false) {
  //     router.replace("/");
  //   }
  // }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <main className="grid grid-cols-12 gap-y-5 md:gap-y-10 min-h-[600px]">
        {" "}
        <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 md:gap-x-7">
          <p>
            <LoginButton />
          </p>
        </div>
      </main>
    );
  }

  const Intro =
    page?.sections instanceof Array &&
    page.sections.map((section, index) => {
      switch (section.__component) {
        case "content.content":
          return (
            <section
              id={section.anchor}
              key={`p-${index}`}
              className="relative col-span-12"
            >
              <RichContentRenderer blocks={section.content} />
            </section>
          );
        default:
          console.warn("Unknown section type:", section.__component);
          return null;
      }
    });

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
