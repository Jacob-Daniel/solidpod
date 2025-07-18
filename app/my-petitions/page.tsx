import { auth } from "@/app/auth";
import Link from "next/link";
import CreatePetitionForm from "@/app/components/CreatePetitionForm";
import UserSignedPetitions from "@/app/components/UserSignedPetitions";
import { redirect } from "next/navigation";
import { LayoutSidebar, Page, Petition, User, Signature } from "@/lib/types";
import { getAPI, getAPIAuth } from "@/lib/functions";
import RichContentRenderer from "@/app/components/RichPageContentRender";
import CreateAccountSuccess from "../components/CreateAccountSuccess";

export default async function MyPetitions() {
	const session = await auth();
	if (session === null) {
		redirect("/login");
	} else {
		const [data, myPetitions, user] = await Promise.all([
			getAPI<Page[]>(`/pages?filters[slug][$eq]=my-petitions&populate=*`),
			getAPIAuth<Petition>("/myPetitions", session.jwt),
			getAPIAuth<User>("/users/me", session.jwt),
		]);

		const userId = user?.documentId;

		if (!userId) {
			throw new Error("User not found");
		}

		const signatures = await getAPI<Signature[]>(
			`/signatures?filters[user][documentId][$eq]=${userId}&populate=user`,
		);
		const accountCreated = new Date(user.createdAt);
		return (
			<main className="grid grid-cols-12 col-span-12 mb-20 pt-5">
				<div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 px-5 lg:px-0 md:gap-x-10">
					<section className="col-span-12 lg:px-0 md:col-span-8">
						<CreateAccountSuccess />
						{data[0] &&
							data[0].sections instanceof Array &&
							data[0].sections.map((section, index) => {
								switch (section.__component) {
									case "content.content":
										return (
											<div
												key={`p-${index}`}
												className="relative col-span-12 mb-10"
											>
												<RichContentRenderer
													blocks={section.content}
													className=""
												/>
												<ul>
													<li>name: {user.username}</li>
													<li>email: {user.email}</li>
													<li>joined: {accountCreated.toLocaleString()}</li>
													<li></li>
												</ul>
											</div>
										);
									case "layout.featured":
										return (
											<div
												key={`p-${index}`}
												className="relative col-span-12 grid grid-cols-12 pb-20"
											></div>
										);

									default:
										console.warn("Unknown section type:", section.__component);
										return null;
								}
							})}
						<div className="col-span-12 mb-10">
							<h2 className="font-sans font-bold md:text-lg">My Petitions </h2>
							<span className="text-sm font-normal">(view live)</span>
							<ul>
								{myPetitions &&
									myPetitions instanceof Array &&
									myPetitions.map((petition: Petition, index) => {
										return (
											<li key={index}>
												<Link
													data-link="link"
													className={`font-sans underline align-bottom hover:text-yellow-500 pb-2 underscore`}
													href={`${process.env.BASE_URL}/petitions/${petition.slug}`}
												>
													{petition.title}
												</Link>{" "}
											</li>
										);
									})}
							</ul>
							<h2 className="font-sans font-bold md:text-lg">My Petitions</h2>
							<span className="text-sm font-normal">(edit)</span>
							<ul>
								{myPetitions &&
									myPetitions instanceof Array &&
									myPetitions.map((petition: Petition, index) => {
										return (
											<li key={index}>
												<Link
													data-link="link"
													className={`font-sans underline align-bottom hover:text-yellow-500 pb-2 underscore`}
													href={`${process.env.BASE_URL}/my-petitions/${petition.slug}`}
												>
													{petition.title}
												</Link>{" "}
											</li>
										);
									})}
							</ul>
							{!myPetitions && <p>Currently no petitions created.</p>}
						</div>{" "}
						<div className="col-span-12">
							<h2 className="font-sans font-bold md:text-lg">
								Petitions I have signed
							</h2>
							<UserSignedPetitions signatures={signatures} />
						</div>
					</section>
					<aside className="col-span-12 md:col-span-4 flex flex-col gap-y-7 bg-gray-200 rounded p-3">
						<Link href={`${process.env.BASE_URL}/new-petition`}>
							New Petition
						</Link>
					</aside>
				</div>
			</main>
		);
	}
}
