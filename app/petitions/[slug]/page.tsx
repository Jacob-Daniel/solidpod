import type { Metadata } from "next";
import { auth } from "@/app/auth";
import { notFound } from "next/navigation";
import BlurImage from "@/app/components/BlurImage";
import RichPageContentRender from "@/app/components/RichPageContentRender";
// import EventAside from "@/app/components/EventAside";
import Signatures from "@/app/components/Signatures";
import { getAPI } from "@/lib/functions";
import {
	Petition,
	Page,
	Section,
	Signature,
	PetitionMeta,
	ButtonSection,
} from "@/lib/types";
import PetitionStates from "@/app/components/PetitionStats";
import PetitionForm from "@/app/components/PetitionForm";
import SignNowCard from "@/app/components/SignNowCard";
// import { siteMetadata } from "@/lib/utils";
// import type { Organisation } from "@/lib/types";
// const getOrg = cache(() =>
// 	getAPI<Organisation>("/organisation/prx2scjjsc0ie8p62ixai9hq"),
// );

// export async function generateMetadata(): Promise<Metadata> {
// 	const data = await getOrg();

// 	const general = data?.name
// 		? [
// 				{
// 					title: data.name,
// 					tagline: data.summary ?? "",
// 					image: data.logo ?? "",
// 					website: data.name,
// 					slug: data.name,
// 				},
// 			]
// 		: [];

// 	return siteMetadata({
// 		address: data.manages_places[0].address || [],
// 		contact: data.people || [],
// 		social: (data.social_media && data.social_media.social) || [],
// 		geolocation: data.manages_places[0].geo || [],
// 		general: general,
// 		seo: {
// 			seo_description: data.summary,
// 			seo_key_words: data.slug,
// 			seo_category: "community",
// 		},
// 	});
// }

type Params = Promise<{ parent: string; slug: string }>;

interface IParams {
	slug: string;
}

export async function generateStaticParams(): Promise<IParams[]> {
	const petition = await getAPI<Petition[]>("/petitions?fields[0]=slug");
	return petition.map((petition) => ({ slug: petition.slug }));
}

export default async function PetitionPage({ params }: { params: Params }) {
	let { slug } = await params;
	if (!slug) return notFound();
	const session = await auth();
	const userDocId = (session && session.user.documentId) ?? "";
	const [pageData, petitionData, signatureData] = await Promise.all([
		getAPI<Page[]>(
			"/pages?filters[slug][$eq]=petition&populate[sections][on][layout.petition-section][populate]=*&populate[sections][on][layout.social-platforms][populate]=*&populate[sections][on][layout.comment-section][populate]=*&populate[sidebar][on][layout.sidebar][populate]=*&populate[sidebar][on][form.form-section][populate]=*&populate[sidebar][on][content.petition-stats][populate]=*&populate[sections][on][elements.button][populate]=*",
		),
		getAPI<Petition[]>(
			`/petitions?filters[slug][$eq]=${slug}&populate[0]=tags&populate[1]=target&populate[2]=signatures&populate[3]=image&populate[4]=target&populate[5]=createdByUser`,
		),
		getAPI<Signature[]>(
			`/signatures?filters[petition][slug][$eq]=${slug}&filters[$and][1][comment][$notnull]=true&populate=user`,
		),
	]);

	const [page]: Page[] = pageData;
	const [petition]: Petition[] = petitionData;
	const [signatures]: Signature[] = signatureData;
	// console.log(signatureData, "sig data");

	if (!page) {
		notFound();
	}
	const petitionMeta: PetitionMeta = {
		// locale: petition.locale,
		end_date: petition.end_date,
		signaturesCount: petition.signaturesCount,
		targetCount: petition.targetCount,
		tags: petition.tags,
		createdByUser: petition.createdByUser,
		target: petition.target,
		// local: petition.local,
	};
	// const target = page.sections[1].target
	console.log(page.sections[1], "sections target");
	return (
		<main className="grid grid-cols-12 col-span-12 mb-20 pt-5">
			<div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 px-5 lg:px-0 md:gap-x-5">
				{!petition && (
					<section className="md:px-5 lg:px-0 col-span-12 lg:col-start-2 lg:col-span-7">
						<p>petition not found</p>
					</section>
				)}
				{petition && (
					<PageContent
						petition={petition}
						signatures={signatureData}
						button={page.sections[1]}
					/>
				)}
				<aside className="col-span-12 md:col-span-4 flex flex-col gap-y-7">
					{page &&
						page.sidebar instanceof Array &&
						page.sidebar.map((p, index) => {
							switch (p.__component) {
								case "form.form-section":
									return (
										<PetitionForm
											key="form"
											id={page.sections[1].hash}
											section={p}
											className="bg-blue-200"
											userDocumentId={userDocId}
											petitionDocumentId={petition.documentId}
											petitionTitle={petition.title}
										/>
									);
								case "content.petition-stats":
									return (
										<PetitionStates key="key" stats={p} data={petitionMeta} />
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

const PageContent = ({
	petition,
	signatures,
	button,
}: {
	petition: Petition;
	signatures: Signature[];
	button: ButtonSection;
}) => {
	return (
		<section className="col-span-12 md:col-span-8 flex flex-col justify-start ">
			<BlurImage
				width={500}
				height={500}
				className="z-50 mb-3 lg:mb-5"
				title={petition.title}
				sourceUrl={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${petition.image.url}`}
				shadow={false}
				rounded={false}
				objectFit="contain"
				priority={false}
			/>

			<SignNowCard
				key="key"
				count={petition.signaturesCount}
				button={button}
				classes="md:hidden"
			/>

			<div className="col-span-12 mb-10">
				<h2 className="font-bold text-2xl lg:text-4xl mb-3 font-sans">
					{petition.title}
				</h2>
				<RichPageContentRender blocks={petition.demand} className="mb-10" />
				<h3 className="font-bold text-xl mb-3 lg:mb-5 font-sans">
					Reason to sign
				</h3>
				<RichPageContentRender blocks={petition.reason} className="" />
			</div>
			<h3 className="font-bold text-xl lg:mb-5 font-sans">Signatures</h3>
			<Signatures signatures={signatures} />
		</section>
	);
};

const SignatureCard = ({ signature }: { signature: Signature }) => {
	const displayName = signature.anonymize ? "Anonymous" : signature.name;
	const date = new Date(signature.createdAt).toLocaleDateString();

	return (
		<div className="rounded-xl shadow-md bg-white p-4 mb-4 border border-gray-200">
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-lg font-semibold">{displayName}</h3>
				<span className="text-sm text-gray-500">{date}</span>
			</div>
			<p className="text-gray-700">{signature.comment}</p>

			{/* Placeholder for future features */}
			<div className="mt-3 flex items-center justify-end">
				{/* Example: Like button */}
				{/* <button className="text-sm text-blue-500 hover:underline">Like</button> */}
			</div>
		</div>
	);
};
