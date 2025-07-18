"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Link from "next/link";
import ShowDate from "@/app/components/ShowDate";
import PetitionStatsCard from "@/app/components/PetitionStatsCard";
import "swiper/css";
import "swiper/css/pagination";
import BlurImage from "./BlurImage";
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
							className="col-span-12 md:col-span-4 overflow-hidden border rounded border-gray-300 hover:shadow"
						>
							<Link
								href={`${process.env.BASE_URL}/petitions/${petition.slug}`}
								className="petition relative block max-h-[150px] md:max-h-[130px] xl:max-h-[180px]"
							>
								{petition.image.url && (
									<BlurImage
										width={500}
										height={500}
										className="z-30"
										title={petition.title}
										sourceUrl={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${petition.image.url}`}
										shadow={false}
										rounded={false}
										objectFit="contain"
										priority={false}
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
}: {
	id: number;
	summary: string;
	path: string;
	route: string;
	title: string;
	end_date: string;
	signatureCount: number;
	targetCount: number;
}) {
	return (
		<div className="relative bottom-0 w-full mb-0 flex flex-col py-2 px-3 justify-evenly z-50 gap-y-2 bg-white">
			<Link href={route} className="block font-sans link font-bold capitalize">
				{title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}
			</Link>
			<PetitionStatsCard
				signaturesCount={signatureCount}
				targetCount={targetCount}
				title={title}
				endDate={end_date}
				slug={path}
			/>
		</div>
	);
}
