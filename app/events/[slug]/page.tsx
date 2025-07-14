import type { Metadata } from "next";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import BannerTop from "@/app/components/BannerTop";
import BlurImage from "@/app/components/BlurImage";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import EventAside from "@/app/components/EventAside";
import { getAPI } from "@/lib/functions";
import { Event, Page, EventSidebar } from "@/lib/types";

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
	const events = await getAPI<Event[]>("/events?fields[0]=slug");
	return events.map((event) => ({ slug: event.slug }));
}

export default async function EventPage({ params }: { params: Params }) {
	// "use cache";
	let { slug } = await params;
	if (!slug) return notFound();
	console.log(slug, "slug");
	// cacheTag(slug);
	const [pageData, eventData] = await Promise.all([
		getAPI<Page[]>(
			"/pages?filters[slug][$eq]=event&populate[banner][populate][image_versions][populate]=image&populate[sidebar][on][layout.event-sidebar][populate]=*",
		),
		getAPI<Event[]>(
			`/events?filters[slug][$eq]=${slug}&populate[location][populate][0]=address&populate=image`,
		),
	]);
	const [page]: Page[] = pageData;
	const [event]: Event[] = eventData;
	console.log(slug, "slug", page, "eve");

	if (!page) {
		notFound();
	}
	const sidebar = (page?.sidebar as EventSidebar[])[0];

	return (
		<main className="col-span-12 mb-20">
			{page.banner && <BannerTop banner={page.banner} />}
			<div className="grid grid-cols-12 col-span-12 px-5 lg:px-0 gap-y-10 md:gap-x-5 lg:gap-x-10 py-10">
				{!event && (
					<section className="md:px-5 lg:px-0 col-span-12 lg:col-start-2 lg:col-span-7">
						<p>event not found</p>
					</section>
				)}
				{event && (
					<>
						<section className="col-span-12 md:col-span-8 lg:col-start-2 lg:col-span-7">
							<h2 className="font-sans font-bold text-2xl md:text-4xl leading-8 md:leading-12 mb-3">
								{event.title}
							</h2>
							<RichPageContentRender blocks={event.content} className="" />
							<BlurImage
								className=""
								height={500}
								objectFit="contain"
								rounded={false}
								shadow={false}
								sourceUrl={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${event.image.url}`}
								title={""}
								width={500}
								priority={false}
							/>
						</section>
					</>
				)}

				{page && sidebar.__component === "layout.event-sidebar" && (
					<EventAside
						className="col-span-12 md:col-span-4 lg:col-span-3"
						sidebar={sidebar}
						event={event}
					/>
				)}
			</div>
		</main>
	);
}
