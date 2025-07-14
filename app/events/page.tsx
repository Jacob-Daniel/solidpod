// import { cache } from "react";
import type { Metadata } from "next";
import { siteMetadata } from "@/lib/utils";
import { Suspense } from "react";
// import { unstable_cacheTag as cacheTag } from "next/cache";
import { getAPI } from "@/lib/functions";
import BannerTop from "@/app/components/BannerTop";
import type { Page, Organisation, General } from "@/lib/types";
import Calendar from "@/app/components/Calendar";
import EventListCurrent from "@/app/components/EventListCurrent";

const getOrg = getAPI<Organisation>(
	"/organisations/m1usdyu61dqrpkal9vtk0bab?populate[logo]=true&populate[social_media][populate][social]=true&populate[manages_places][filters][slug][$eq]=factory-building&populate[manages_places][populate][address][populate]=geo_location",
);

const getPage = getAPI<Page[]>(
	"/pages?filters[slug][$eq]=events&populate[sections][on][content.content]=*&populate[sections][on][layout.featured-events-section][populate]=*&populate[sections][on][layout.calendar][populate]=*&populate[banner][populate][image_versions][populate]=image",
);

const [pageData, orgData] = await Promise.all([getPage, getOrg]);

export default async function Events() {
	const [events, eventPageData] = await Promise.all([
		getAPI<Event[]>(`/event-utils/filtered`),
		getAPI<Page[]>(
			"/pages?filters[slug][$eq]=events&populate[sections][on][content.content]=*&populate[sections][on][layout.featured-events-section][populate]=*&populate[sections][on][layout.calendar][populate]=*&populate[banner][populate][image_versions][populate]=image",
		),
	]);

	const [page] = eventPageData || [];

	if (!page) {
		return <div>Page not found</div>;
	}

	return (
		<Suspense
			fallback={
				<main className="grid grid-cols-12 gap-y-10 mb-20">Loading...</main>
			}
		>
			<main className="grid grid-cols-12 gap-y-10 mb-20">
				{page?.banner && <BannerTop banner={page?.banner} />}

				<div className="grid grid-cols-12 md:gap-x-5 lg:gap-x-10 px-5 lg:col-start-2 col-span-12 lg:col-span-10 lg:px-0">
					{page?.sections
						?.filter((section) => section.__component !== "layout.banner")
						.map((section, index) => {
							switch (section.__component) {
								case "layout.featured-events-section":
									return (
										<section
											id="events-list"
											className="col-span-12 md:col-span-8"
											key={`sec-${index}`}
										>
											{events?.length > 0 && (
												<EventListCurrent
													key={`events-${index}`}
													events={events}
												/>
											)}
										</section>
									);

								case "layout.calendar":
									return (
										<aside
											className="col-span-12 md:col-span-4"
											key={`cal-${index}`}
										>
											<Calendar key={`calendar`} events={events} />
										</aside>
									);

								default:
									console.warn("Unknown section type:", section.__component);
									return null;
							}
						})}
				</div>
			</main>
		</Suspense>
	);
}
