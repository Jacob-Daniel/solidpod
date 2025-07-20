// import { unstable_cacheTag as cacheTag } from "next/cache";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { getAPI, getAPIAuth } from "@/lib/functions";
import Aside from "@/app/components/Aside";
import CreatePetitionForm from "@/app/components/CreatePetitionForm";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import GeneratePDFButton from "@/app/components/GeneratePDFButton";
import { LayoutSidebar, Page, Petition, User } from "@/lib/types";
// import {CreatePetitionPDF} from "@/lib/actions"

type Params = Promise<{ parent: string; slug: string }>;

interface IParams {
	slug: string;
}

export default async function EditPetitionPage({ params }: { params: Params }) {
	let { slug } = await params;
	const session = await auth();
	if (!session) {
		redirect("/login");
		return null;
	} else {
		const userDocId = session.user.documentId;
		const user: User = session.user;
		const [[petitionData]] = await Promise.all([
			getAPI<Petition[]>(`/petitions?filters[slug][$eq]=${slug}&populate=*`),
		]);
		console.log(session, "sess data");
		if (!petitionData)
			return (
				<main className="grid grid-cols-12 col-span-12 min-h-[500px]">
					<div className="grid grid-cols-12 md:grid-cols-10 col-span-12 px-5 md:px-0 md:col-start-2 md:col-span-10 pt-10 md:gap-x-10 lg:gap-x-16 mb-20">
						<section className="col-span-12 md:col-span-6">
							content not found
						</section>
					</div>
				</main>
			);
		return (
			<main className="grid grid-cols-12 col-span-12 mt-5">
				<div className="grid grid-cols-12 lg:grid-cols-10 col-span-12 px-5 lg:px-0 lg:col-start-2 lg:col-span-10 md:gap-x-10 lg:gap-x-16 mb-20">
					<section className="col-span-12 md:col-span-8">
						{petitionData &&
							petitionData.sections instanceof Array &&
							petitionData.sections.map((section, index) => {
								switch (section.__component) {
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
						<GeneratePDFButton
							documentId={petitionData.documentId}
							jwt={session.jwt}
							classes="border border-gray-400 rounded block px-1 cursor-pointer "
						/>
					</section>
				</div>
			</main>
		);
	}
}
