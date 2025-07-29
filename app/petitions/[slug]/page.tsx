import { auth } from "@/app/auth";
import { notFound } from "next/navigation";
import { getAPI, getPagAPI } from "@/lib/functions";
import {
	Petition,
	Page,
	Signature,
	PetitionMeta,
	ButtonSection,
	API,
	Meta,
} from "@/lib/types";

import BlurDataImage from "@/app/components/BlurDataImage";
import RichPageContentRender from "@/app/components/RichPageContentRender";

import Signatures from "@/app/components/Signatures";
import PetitionStates from "@/app/components/PetitionStats";
import PetitionForm from "@/app/components/PetitionForm";
import SignNowCard from "@/app/components/SignNowCard";
import { Metadata } from "next";

interface Params {
	parent: string;
	slug: string;
}

interface IParams {
	slug: string;
}

async function fetchPageData() {
	return getAPI<Page[]>(
		"/pages?filters[slug][$eq]=petition&populate[sections][on][layout.petition-section][populate]=*&populate[sections][on][layout.social-platforms][populate]=*&populate[sections][on][layout.comment-section][populate]=*&populate[sidebar][on][layout.sidebar][populate]=*&populate[sidebar][on][form.form-section][populate]=*&populate[sidebar][on][content.petition-stats][populate]=*&populate[sections][on][elements.button][populate]=*",
	);
}

async function fetchPetitionData(slug: string) {
	return getAPI<Petition[]>(
		`/petitions?filters[slug][$eq]=${slug}&populate[0]=tags&populate[1]=target&populate[2]=signatures&populate[3]=image&populate[4]=target&populate[5]=createdByUser`,
	);
}

async function fetchSignatureData(slug: string) {
	return getPagAPI<Signature[]>(
		`/signatures?filters[$and][0][petition][slug][$eq]=${slug}&filters[$and][1][comment][$notNull]=true&populate=user&pagination[page]=1&pagination[pageSize]=2`,
	);
}

export async function generateStaticParams(): Promise<IParams[]> {
	const petition = await getAPI<Petition[]>("/petitions?fields[0]=slug");
	return petition.map((petition) => ({ slug: petition.slug }));
}

export default async function PetitionPage({ params }: { params: Params }) {
	const { slug } = params;
	if (!slug) return notFound();

	const session = await auth();
	const userDocId = (session && session.user.documentId) ?? "";

	const [pageData, petitionData, { data: signatures, meta }] =
		await Promise.all([
			fetchPageData(),
			fetchPetitionData(slug),
			fetchSignatureData(slug),
		]);
	const [page]: Page[] = pageData;
	const [petition]: Petition[] = petitionData;

	if (!page || !petition) {
		notFound();
	}

	const petitionMeta: PetitionMeta = {
		end_date: petition.end_date,
		signaturesCount: petition.signaturesCount,
		targetCount: petition.targetCount,
		tags: petition.tags,
		createdByUser: petition.createdByUser,
		target: petition.target,
	};

	return (
		<main className="grid grid-cols-12 col-span-12 mb-20 pt-5">
			<div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 px-5 lg:px-0 md:gap-x-5">
				<PageContent
					petition={petition}
					signatures={signatures}
					button={page.sections[1]}
					meta={meta}
					slug={slug}
				/>

				<Sidebar
					page={page}
					userDocId={userDocId}
					petition={petition}
					petitionMeta={petitionMeta}
				/>
			</div>
		</main>
	);
}

const PageContent = ({
	petition,
	signatures,
	button,
	meta,
	slug,
}: {
	petition: Petition;
	signatures: Signature[];
	button: ButtonSection;
	meta: Meta;
	slug: string;
}) => {
	return (
		<section className="col-span-12 md:col-span-8 flex flex-col justify-start">
			<BlurDataImage
				className="z-50 mb-3 lg:mb-5 w-full"
				title={petition.title}
				image={petition.image}
				shadow={false}
				rounded={false}
				objectFit="contain"
				priority={true}
				height={petition.image.height}
				width={petition.image.width}
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
				<RichPageContentRender blocks={petition.demand} className="mb-16" />
			</div>
			<div className="col-span-12 mb-10">
				<h3 className="font-bold text-xl mb-3 lg:mb-3 font-sans">
					Reason to sign
				</h3>
				<RichPageContentRender blocks={petition.reason} className="" />
			</div>

			<h3 className="font-bold text-xl lg:mb-5 font-sans">Comments</h3>
			<Signatures
				signatures={signatures}
				totalCount={meta.pagination.total}
				pageSize={meta.pagination.pageSize}
				slug={slug}
			/>
		</section>
	);
};

const Sidebar = ({
	page,
	userDocId,
	petition,
	petitionMeta,
}: {
	page: Page;
	userDocId: string;
	petition: Petition;
	petitionMeta: PetitionMeta;
}) => {
	return (
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
									className=""
									userDocumentId={userDocId}
									petitionDocumentId={petition.documentId}
									petitionTitle={petition.title}
								/>
							);
						case "content.petition-stats":
							return (
								<PetitionStates key="stats" stats={p} data={petitionMeta} />
							);
						default:
							console.warn("Unknown section type:", p.__component);
							return null;
					}
				})}
		</aside>
	);
};
