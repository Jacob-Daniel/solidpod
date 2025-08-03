"use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";
import Link from "next/link";
// import ShowDate from "@/app/components/ShowDate";
import PetitionStatsCard from "@/app/components/PetitionStatsCard";
import "swiper/css";
import "swiper/css/pagination";
import BlurDataImageClient from "@/app/components/BlurDataImageClient";
import { FeaturedSection, Petition } from "@/lib/types";

export default function FeaturedSwiper({
	featured,
	section,
	view,
	gap,
}: {
	featured: Petition[];
	section: FeaturedSection;
	view: number;
	gap: number;
}) {
	return (
		<>
			{featured &&
				featured instanceof Array &&
				featured.map((petition: Petition, index) => {
					return (
						<div
							key={index}
							className="col-span-12 md:col-span-4 overflow-hidden border rounded border-gray-300 dark:border-zinc-500 hover:shadow"
						>
							<Link
								href={`${process.env.BASE_URL}/petitions/${petition.slug}`}
								className="petition relative block"
							>
								{petition.image.url && (
									<BlurDataImageClient
										className="z-30"
										title={petition.title}
										image={petition.image}
										shadow={false}
										rounded={false}
										objectFit="contain"
										priority={true}
										height={petition.image.height}
										width={petition.image.width}
									/>
								)}
							</Link>
							<Text
								id={petition.id}
								summary={petition.title}
								path={petition.slug}
								route={`${process.env.BASE_URL}/petitions/${petition.slug}`}
								title={petition.title}
								end_date={petition.end_date}
								signatureCount={petition.signaturesCount}
								targetCount={petition.targetCount}
								lastSignature={petition.last_signature}
							/>
						</div>
					);
				})}
		</>
	);
}

function Text({
	id,
	summary,
	path,
	route,
	title,
	end_date,
	signatureCount,
	targetCount,
	lastSignature,
}: {
	id: number;
	summary: string;
	path: string;
	route: string;
	title: string;
	end_date: string;
	signatureCount: number;
	targetCount: number;
	lastSignature: string;
}) {
	return (
		<div className="relative bottom-0 w-full mb-0 flex flex-col pb-2 pt-1 px-3 justify-evenly z-50 gap-y-2 bg-white dark:bg-inherit">
			<Link href={route} className="block font-sans link font-bold">
				{title}
			</Link>
			<PetitionStatsCard
				signatureCount={signatureCount}
				targetCount={targetCount}
				title={title}
				endDate={end_date}
				slug={path}
				lastSignature={lastSignature}
			/>
		</div>
	);
}
