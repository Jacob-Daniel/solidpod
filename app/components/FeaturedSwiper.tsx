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
		<section className={`col-span-12 gap-y-0 ${section.bg_colour} relative`}>
			<Swiper
				className="col-span-12"
				modules={[Pagination]}
				slidesPerView={view}
				spaceBetween={gap}
				pagination={{
					el: ".swiper-pagination",
					clickable: true,
					renderBullet: (index, className) => {
						return '<span class="' + className + '"></span>';
					},
				}}
			>
				{featured &&
					featured instanceof Array &&
					featured.map((petition: Petition, index) => {
						return (
							<SwiperSlide
								key={index}
								className="relative mb-0 mb-md-0 overflow-clip"
							>
								<Link
									href={`${process.env.BASE_URL}/petitions/${petition.slug}`}
									className="petition relative"
								>
									<BlurImage
										width={500}
										height={500}
										className="z-50 max-h-[500px] max-w-[500px] mb-0"
										title={petition.title}
										sourceUrl={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${petition.image.url}`}
										shadow={false}
										rounded={false}
										objectFit="contain"
										priority={false}
									/>
								</Link>
								<SwiperText
									id={petition.id}
									summary={petition.summary}
									path={petition.slug}
									route={`${process.env.BASE_URL}/petitions/${petition.slug}`}
									title={petition.title}
									end_date={petition.end_date}
									signatureCount={petition.signaturesCount}
									targetCount={petition.targetCount}
								/>
							</SwiperSlide>
						);
					})}
			</Swiper>
			<div className="swiper-pagination flex justify-center w-full !-bottom-5 gap-x-2"></div>
		</section>
	);
}

function SwiperText({
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
		<div className="bottom-0 w-full bg-blue-600 mb-0 flex flex-col p-2 justify-evenly">
			<Link
				href={route}
				className="block link text-lg md:text-xl text-white capitalize"
			>
				{title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}
			</Link>
			<PetitionStatsCard
				signaturesCount={signatureCount}
				targetCount={targetCount}
				title={title}
				summary={summary}
				endDate={end_date}
				slug={path}
			/>
		</div>
	);
}
