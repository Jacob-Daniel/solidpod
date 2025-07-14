"use client";
import Link from "next/link";
// import ShowDate from "@/app/components/ShowDate";
import RichPageContentRender from "@/app/components/RichPageContentRender";
import BlurImage from "./BlurImage";
import { FeaturedEventSection, Event } from "@/lib/types";

// type EventMap = Record<number, string>;

export default function FeaturedSwiper({
	section,
	featuredEvents,
}: {
	section: FeaturedEventSection;
	featuredEvents: Event[];
}) {
	return (
		<section className={`col-span-12 gap-y-0 ${section.bg_colour} relative`}>
			<h2 className="font-sans text-lg md:text-2xl font-bold">
				{section.heading}
			</h2>
			<RichPageContentRender className="" blocks={section.content} />
			<div className="col-span-12  grid grid-cols-12 md:gap-x-5">
				{featuredEvents &&
					featuredEvents instanceof Array &&
					featuredEvents.map((event: Event, index) => {
						const [, startTime] = event.start_date.split("T");
						const [, endTime] = event.end_date.split("T");
						return (
							<div
								key={index}
								className="col-span-12 md:col-span-4 relative mb-0 mb-md-0 overflow-clip"
							>
								<Link
									href={`${process.env.BASE_URL}/events/${event.slug}`}
									className="event relative"
								>
									<BlurImage
										width={500}
										height={500}
										className="z-50 max-h-[500px] max-w-[500px] mb-0"
										title={event.title}
										sourceUrl={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${event.image.url}`}
										shadow={false}
										rounded={false}
										objectFit="contain"
										priority={false}
									/>
								</Link>
								<Text
									id={event.id}
									summary={event.summary}
									path={event.slug}
									route={`${process.env.BASE_URL}/events/${event.slug}`}
									price={event.price}
									title={event.title}
									start_time={startTime}
									end_time={endTime}
									start_date={event.start_date}
									end_date={event.end_date}
								/>
							</div>
						);
					})}
			</div>
		</section>
	);
}

function Text({
	id,
	summary,
	path,
	route,
	price,
	title,
	start_time,
	end_time,
	start_date,
	end_date,
}: {
	id: number;
	summary: string;
	path: string;
	route: string;
	price: number;
	title: string;
	start_time: string;
	end_time: string;
	start_date: string;
	end_date: string;
}) {
	return (
		<div className="bottom-0 w-full bg-blue-600 mb-0 flex flex-col p-2 justify-evenly">
			<p className="px-2 py-1 text-center text-white lg:text-lg relative text-body mx-auto text-sm">
				<Link
					href={route}
					className="block link text-center mx-auto leading-5 text-[1rem] text-white "
				>
					{title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}
				</Link>
				<span
					className="mb-0 block text-sm leading-5 text-white"
					suppressHydrationWarning
				>
					{start_time && start_time.substring(0, 5)}-
					{end_time && end_time.substring(0, 5)}{" "}
					{/*<ShowDate date={start_date} type={true} />*/}
				</span>
			</p>
		</div>
	);
}
