import { auth } from "@/app/auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import UlPageContentAnchors from "@/app/components/UlPageContentAnchors";
import Link from "next/link";
import UserSignedPetitions from "@/app/components/UserSignedPetitions";
import { Page, Petition, User, Signature } from "@/lib/types";
import { getAPI, getAPIAuth } from "@/lib/functions";
import RichContentRenderer from "@/app/components/RichPageContentRender";
import CreateAccountSuccess from "../components/CreateAccountSuccess";
type Tags = {
	label: string;
	target: string;
	fragment: string;
};
async function fetchPage() {
	return getAPI<Page[]>(`/pages?filters[slug][$eq]=my-petitions&populate=*`);
}

async function fetchPetitions(jwt: string) {
	console.log(jwt, "jwt");
	return getAPIAuth<Petition>("/user-petitions", jwt);
}

async function fetchUser(jwt: string) {
	return getAPIAuth<User>("/users/me", jwt);
}

export default async function MyPetitions() {
	const session = await auth();
	if (session === null) {
		redirect("/login");
	} else {
		const [[data], myPetitions, user] = await Promise.all([
			fetchPage(),
			fetchPetitions(session.jwt),
			fetchUser(session.jwt),
		]);

		const userId = user?.documentId;

		if (!userId) {
			throw new Error("User not found");
		}

		const signatures = await getAPI<Signature[]>(
			`/signatures?filters[user][documentId][$eq]=${userId}&populate=user`,
		);
		const accountCreated = new Date(user.createdAt);

		const tags: Tags[] =
			data?.sections
				?.filter((section) => section.__component === "content.content")
				?.map((section) => ({
					fragment: section?.anchor as string,
					label: section?.anchor as string,
					target: "_self",
				})) ?? [];

		return (
			<main className="grid grid-cols-12 col-span-12 mb-20 pt-5">
				<div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 px-5 lg:px-0 md:gap-x-7">
					<section className="col-span-12 md:col-span-9 border border-gray-300 p-3 rounded">
						<CreateAccountSuccess />
						{data &&
							data.sections instanceof Array &&
							data.sections.map((section, index) => {
								switch (section.__component) {
									case "content.content":
										if (section.anchor === "details")
											return (
												<div
													id={section.anchor}
													key={`p-${index}`}
													className="relative col-span-12 mb-10"
												>
													<RichContentRenderer
														blocks={section.content}
														className=""
													/>
													<ul>
														<li className="first:capitalize">
															name: {user.username}
														</li>
														<li className="first:capitalize">
															email: {user.email}
														</li>
														<li className="first:capitalize">
															joined: {accountCreated.toLocaleString()}
														</li>
														<li className="first:capitalize"></li>
													</ul>
												</div>
											);
										if (section.anchor === "new-petition")
											return (
												<div
													id={section.anchor}
													key={`p-${index}`}
													className="relative col-span-12 mb-10"
												>
													<RichContentRenderer
														blocks={section.content}
														className=""
													/>
													<Link
														href={`${process.env.BASE_URL}/new-petition`}
														className="bg-yellow-300 rounded-lg p-2 font-bold"
													>
														New Petition
													</Link>
												</div>
											);

										if (section.anchor === "comments")
											return (
												<div
													id={section.anchor}
													key={`p-${index}`}
													className="relative col-span-12 mb-10"
												>
													<RichContentRenderer
														blocks={section.content}
														className=""
													/>
													<UserSignedPetitions signatures={signatures} />
												</div>
											);
										if (section.anchor === "petitions")
											return (
												<div
													id={section.anchor}
													key={`p-${index}`}
													className="relative col-span-12 mb-10"
												>
													<RichContentRenderer
														blocks={section.content}
														className=""
													/>

													<ul>
														{myPetitions &&
															myPetitions instanceof Array &&
															myPetitions.map((petition: Petition, index) => {
																return (
																	<div key={index} className="mb-2">
																		<li>
																			<Link
																				data-link="link"
																				className={`font-sans underline align-bottom hover:text-yellow-500 pb-2 underscore`}
																				href={`${process.env.BASE_URL}/petitions/${petition.slug}`}
																			>
																				{petition.title}
																			</Link>{" "}
																			<span className="text-sm font-normal">
																				(view live)
																			</span>
																		</li>
																		<li>
																			{" "}
																			<Link
																				data-link="link"
																				className={`font-sans underline align-bottom hover:text-yellow-500 pb-2 underscore`}
																				href={`${process.env.BASE_URL}/my-petitions/${petition.slug}`}
																			>
																				{petition.title}
																			</Link>{" "}
																			<span className="text-sm font-normal">
																				(edit)
																			</span>
																		</li>
																	</div>
																);
															})}
													</ul>
												</div>
											);
										{
											!myPetitions && <p>Currently no petitions created.</p>;
										}

									default:
										console.warn("Unknown section type:", section.__component);
										return null;
								}
							})}
					</section>
					<aside className="flex-1 col-span-12 md:col-span-3 flex flex-col gap-y-7 border p-3 rounded border-gray-200 bg-gray-100 shadow relative">
						{data &&
							data.sidebar instanceof Array &&
							data.sidebar.map((block, index: number) => {
								switch (block.__component) {
									case "layout.sidebar":
										return (
											<div
												key={index}
												className="sticky absolute top-3 text-sm"
											>
												{block && block.heading && (
													<p className="mb-2">{block.heading}</p>
												)}{" "}
												<UlPageContentAnchors
													list={tags}
													type="sidebar"
													className="text-sm overflow-y-auto max-h-[30vh] thin-scrollbar"
													classNameLi="pb-1 !leading-none"
													page="my-petitions"
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
}
