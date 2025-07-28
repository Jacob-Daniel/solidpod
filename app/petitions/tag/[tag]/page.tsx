import { ReactNode } from "react";
import { getAPI } from "@/lib/functions";
import FeaturedPetitions from "@/app/components/FeaturedPetitions";
import BannerTop from "@/app/components/BannerTop";
import { notFound } from "next/navigation";

import {
	Page,
	Event,
	FeaturedSection,
	PlacesSection,
	SharedSEO,
	Petition,
} from "@/lib/types";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import H2 from "@/app/components/H2";

// export async function generateStaticParams(): Promise<IParams[]> {
// 	const petition = await getAPI<Petition[]>("/petitions?fields[0]=slug");
// 	return petition.map((petition) => ({ slug: petition.slug }));
// }

interface Params {
	parent: string;
	tag: string;
}

interface IParams {
	tag: string;
}

export default async function PetitionTagPage({ params }: { params: Params }) {
	const { tag } = await params;
	if (!tag) return notFound();
	const [featured, [data]] = await Promise.all([
		getAPI<Petition[]>(`/featured-petitions?tagSlug=${tag}`),
		getAPI<Page[]>(
			"/pages?filters[slug][$eq]=petitions-tag-page&populate[banner][populate][image_versions][populate]=image&populate[sections][on][layout.featured][populate]=*&populate[sections][on][content.content][populate]=*",
		),
	]);
	console.log(featured, "featured");
	if (!data) return <div>No content available</div>;
	return (
		<main className="grid grid-cols-12 gap-y-10">
			{data.banner && (
				<div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12">
					<BannerTop banner={data.banner} />
				</div>
			)}
			<div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12 px-5 lg:px-0">
				{data &&
					data.sections instanceof Array &&
					data.sections.map((section, index) => {
						switch (section.__component) {
							case "content.content":
								return (
									<div key={`a-${index}`} className="relative col-span-12">
										<RichPageContentRender
											blocks={section.content}
											className="w-full"
										/>
									</div>
								);

							case "layout.featured":
								return (
									<div
										key={`p-${index}`}
										className="relative col-span-12 grid grid-cols-12 pb-20"
									>
										{(featured.length > 0 && (
											<Frame section={section}>
												<FeaturedPetitions
													featured={featured}
													section={section}
													view={3}
													gap={30}
												/>
											</Frame>
										)) || (
											<div className="col-span-12">
												<h2 className="text-xl font-bold">None found</h2>
											</div>
										)}
									</div>
								);

							default:
								console.warn("Unknown section type:", section.__component);
								return null;
						}
					})}
			</div>
		</main>
	);
}

function Frame({
	section,
	children,
}: {
	section: FeaturedSection | PlacesSection;
	children: ReactNode;
}) {
	return (
		<div className="relative col-span-12 grid grid-cols-12 mb-10">
			{/*      <header className="col-span-12 flex flex-col">
        <H2
          child={section.heading}
          className="text-lg md:text-lg lg:text-2xl leading-none font-bold font-sans mb-2"
        />
      </header>*/}
			<div className="col-span-12 grid grid-cols-12 md:flex-row gap-y-5 lg:px-0 md:gap-x-5">
				{children}
			</div>
		</div>
	);
}
