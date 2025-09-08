import { Suspense } from "react";
import { auth } from "@/app/auth";
import { notFound } from "next/navigation";
import { getAPI, getPagAPI } from "@/lib/functions";
import {
	Category,
	Page,
	Signature,
	PetitionMeta,
	ButtonSection,
	API,
	Meta,
} from "@/lib/types";

import BlurServerImage from "@/app/components/BlurDataImage";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import BannerTop from "@/app/components/BannerTop";

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
	return getAPI<Page[]>("/pages?filters[slug][$eq]=archive&populate=*");
}

async function fetchArchiveData(slug: string) {
	return getAPI<Category[]>(
		`/categories?filters[slug][$eq]=${slug}&populate[banner][populate][image_versions][populate]=image`,
	);
}

// async function fetchSignatureData(slug: string) {
// 	return getPagAPI<Signature[]>(
// 		`/signatures?filters[$and][0][petitions][slug][$eq]=${slug}&filters[$and][1][comment][$notNull]=true&populate=user&pagination[page]=1&pagination[pageSize]=2`,
// 	);
// }

export async function generateStaticParams(): Promise<IParams[]> {
	const archive = await getAPI<Category[]>("/categories?fields[0]=slug");
	return archive.map((archive) => ({ slug: archive.slug }));
}

export default async function PetitionPage({ params }: { params: Params }) {
	const { slug } = await params;
	if (!slug) return notFound();
	console.log(slug, "slg");
	const session = await auth();
	const userDocId = (session && session.user.documentId) ?? "";

	const [pageData, archiveData] = await Promise.all([
		fetchPageData(),
		fetchArchiveData(slug),
		// fetchSignatureData(slug),
	]);
	const [page]: Page[] = pageData;
	const [category]: Category[] = archiveData;

	if (!page || !category) {
		notFound();
	}

	const buttonSection = page.sections.find(
		(section): section is ButtonSection =>
			section.__component === "elements.button",
	);
	console.log(category, "cat");
	const blurDataUrl = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${category?.banner?.image_versions[1].image.formats.thumbnail.url}`,
	)
		.then((res) => res.arrayBuffer())
		.then(
			(buf) => `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`,
		);
	return (
		<main className="grid grid-cols-12 col-span-12 mb-20 pt-5">
			{category.banner && category.banner.image_versions[0].image && (
				<div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12">
					<BannerTop
						banner={category.banner}
						blurDataUrl={blurDataUrl as string}
					/>
				</div>
			)}
			<div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 px-5 lg:px-0 md:gap-x-5">
				<PageContent category={category} button={buttonSection} slug={slug} />

				<Sidebar page={page} userDocId={userDocId} category={category} />
			</div>
		</main>
	);
}
const PageContent = ({
	category,
	button,
	slug,
}: {
	category: Category;
	button?: ButtonSection;
	slug: string;
}) => {
	return (
		<section className="col-span-12 md:col-span-8 flex flex-col justify-start">
			<div className="col-span-12 mb-10">
				<h2 className="font-bold text-2xl lg:text-4xl mb-3 font-sans">
					{category.name}
				</h2>
			</div>
			<div className="col-span-12 mb-10">
				<h3 className="font-bold text-xl mb-3 lg:mb-3 font-sans">
					Reason to sign
				</h3>
			</div>

			<h3 className="font-bold text-xl lg:mb-5 font-sans">Comments</h3>
		</section>
	);
};

const Sidebar = ({
	page,
	userDocId,
	category,
}: {
	page: Page;
	userDocId: string;
	category: Category;
}) => {
	return (
		<aside className="col-span-12 md:col-span-4 flex flex-col gap-y-7">
			aside
		</aside>
	);
};
