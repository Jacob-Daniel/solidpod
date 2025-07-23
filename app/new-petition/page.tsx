// import { unstable_cacheTag as cacheTag } from "next/cache";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { getAPI, getAPIAuth } from "@/lib/functions";
import Aside from "@/app/components/Aside";
import CreatePetitionForm from "@/app/components/CreatePetitionForm";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import { LayoutSidebar, Page, Petition, User } from "@/lib/types";

export default async function NewPetition() {
	const session = await auth();
	if (!session) {
		redirect("/login");
		return null;
	} else {
		const userDocId = session.user.documentId;
		const user: User = session.user;
		const [[page]] = await Promise.all([
			getAPI<Page[]>(
				`/pages?filters[slug][$eq]=new-petition&populate[sections][on][form.form-section][populate]=*&populate[banner][populate][image_versions][populate]=image&populate[sections][on][content.content]=*`,
			),
		]);
		if (!page)
			return (
				<main className="grid grid-cols-12 col-span-12 min-h-[500px] bg-red-200">
					<div className="grid grid-cols-12 md:grid-cols-10 col-span-12 px-5 md:px-0 md:col-start-2 md:col-span-10 pt-10 md:gap-x-10 lg:gap-x-16 mb-20">
						<section className="col-span-12 md:col-span-6">
							content not found
						</section>
					</div>
				</main>
			);
		return (
			<main className="grid grid-cols-12 col-span-12">
				rfsdfsdsdf
				<div className="grid grid-cols-12 lg:grid-cols-10 col-span-12 px-5 lg:px-0 lg:col-start-2 lg:col-span-10 md:gap-x-10 lg:gap-x-16 mb-20">
					<section className="col-span-12 md:col-span-8">
						{page &&
							page.sections instanceof Array &&
							page.sections.map((section, index) => {
								switch (section.__component) {
									case "content.content":
										return (
											<RichPageContentRender
												key={index}
												blocks={section.content}
												className=""
											/>
										);
									case "form.form-section":
										return (
											<CreatePetitionForm
												key={2}
												section={section}
												className=""
												user={user}
											/>
										);
									default:
										console.warn("Unknown section type:", section.__component);
										return null;
								}
							})}
					</section>
				</div>
			</main>
		);
	}
}
