"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/clientFunctions";
import React from "react";
import { Event } from "@/lib/types";
import BlurImage from "@/app/components/BlurImage";

type EventMap = Record<number, string>;

export default function EventListCurrent({ events }: { events: Event[] }) {
	const searchParams = useSearchParams();
	const date = searchParams.get("date");
	if (!events || events.length === 0) {
		return <p>No current events available.</p>;
	}

	const filtered = date
		? events.filter((event) => {
				const eventDate = new Date(event.start_date)
					.toISOString()
					.split("T")[0];
				return eventDate === date;
			})
		: events;

	return (
		<section className="col-span-12 lg:col-span-8">
			<ul id="eventList" className={`col-span-12 mb-16 grid grid-cols-1 gap-5`}>
				{filtered.map((e: Event) => {
					const startDate = new Date(e.start_date); // This will be a Date object
					const sdTimestamp = startDate.getTime();
					const endDate = new Date(e.end_date); // This will be a Date object
					const edTimestamp = endDate.getTime();
					return (
						<li key={e.id}>
							<Article
								key={e.id}
								id={e.id}
								title={e.title}
								summary={e.summary}
								imagepath={e.image.url}
								start_time={e.start_date.substring(11, 16)}
								end_time={e.end_date.substring(11, 16)}
								start_date={formatDate(new Date(sdTimestamp), true, true)}
								end_date={formatDate(new Date(edTimestamp), true, true)}
								datetime={new Date(sdTimestamp).toISOString().slice(0, 10)}
								price={Number(e.price)}
								path={e.slug}
							></Article>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

type Article = {
	id: number;
	title: string;
	summary: string;
	imagepath: string;
	start_time: string;
	end_time: string;
	start_date: string;
	end_date: string;
	datetime: string;
	path: string;
	price: number;
};

const Article: React.FC<Article> = ({
	id,
	title,
	summary,
	imagepath,
	start_time,
	end_time,
	start_date,
	end_date,
	datetime,
	path,
	price,
}) => {
	const eventUrl = `${process.env.BASE_URL}/events/${path}`;
	return (
		<article
			className={`border-gray-300 border grid grid-cols-12 md:grid-cols-12 bg-white relative md:pb-0`}
		>
			<div className="relative col-span-12 md:col-span-4 lg:col-span-4 relative">
				<Link
					href={eventUrl}
					className="fill-container block flex justify-center"
				>
					<BlurImage
						className=""
						title={title}
						sourceUrl={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${imagepath}`}
						shadow={false}
						rounded={false}
						objectFit="contain"
						priority={false}
						height={200}
						width={200}
					/>
				</Link>
				{/*				<span className="font-bold absolute bottom-0 md:right-0 text-white px-2 bg-customRed mr-3 md:mr-0 capitalize">
					{cat}
				</span>*/}
			</div>
			<div className="col-span-12 md:col-span-8 p-3">
				<header>
					<h1 className="link font-extrabold text-black">
						<Link
							className="text-2xl md:text-xl lg:text-2xl capitalize"
							href={eventUrl}
						>
							{title.length > 20 ? title.substring(0, 20) + "..." : title}
						</Link>
					</h1>
					<EventDate
						start_date={start_date}
						end_date={end_date}
						datetime={datetime}
						start_time={start_time}
						end_time={end_time}
					/>
				</header>
				<footer className="flex flex-col md:flex-wrap">
					<p className="text-base lg:text-md mb-0 text-black">{summary}</p>
					<span
						className={`font-bold text-base inline text-black ${price === 0 && "uppercase w-[45px] font-normal text-green-700 border ps-1 pe-3 mt-1"}`}
					>
						{price === 0 ? "free" : "£" + price}
					</span>
					<a
						className="inline-block self-end  ps-1 pe-2 py-[1px] text-sm rounded text-black border border-gray-300 md:absolute md:right-3 md:bottom-3"
						href={eventUrl}
					>
						{/*<FontAwesomeIcon className="!text-white" icon={faCircleRight} />{" "}*/}
						More..
					</a>
				</footer>
			</div>
		</article>
	);
};

interface DateProps {
	start_date: string;
	end_date: string;
	datetime: string;
	start_time: string;
	end_time: string;
}

const EventDate: React.FC<DateProps> = ({
	start_date,
	end_date,
	datetime,
	start_time,
	end_time,
}) => {
	if (start_date === end_date) {
		return (
			<div className="mb-0 flex flex-row gap-x-2">
				<time
					dateTime={datetime}
					className="mb-0 text-stone-400 text-sm font-bold block"
					suppressHydrationWarning
				>
					{start_date}
				</time>
				<EventTime start={start_time} end={end_time} />
			</div>
		);
	} else {
		return (
			<div className="mb-0 flex flex-row">
				<time
					dateTime={datetime}
					className="mb-0 text-stone-400 text-sm font-bold"
					suppressHydrationWarning
				>
					{start_date}
				</time>
				{<span className="text-stone-400 text-sm font-bold">{" to "}</span>}
				<time
					dateTime={datetime}
					className="mb-0 text-stone-400 text-sm font-bold"
					suppressHydrationWarning
				>
					{end_date}
				</time>
			</div>
		);
	}
};

function EventTime({ start, end }: { start: string; end: string }) {
	const s = start.substring(0, 5);
	const e = end.substring(0, 5);
	if (s === "00:00" && e === "00:00") {
		return (
			<span className="font-bold text-stone-400 me-1 text-sm">(Time TBC)</span>
		);
	} else {
		return (
			<span className="text-stone-400 font-bold text-sm">
				<time dateTime={s}>{s}</time>
				{" - "}
				<time dateTime={e}>{e}</time>
			</span>
		);
	}
}
