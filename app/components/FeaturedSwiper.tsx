"use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { FeaturedSection, Category } from "@/lib/types";

export default function FeaturedSwiper({
	featured,
	section,
	view,
	gap,
}: {
	featured: Category[];
	section: FeaturedSection;
	view: number;
	gap: number;
}) {
	return (
		<div
			className={`${section.bg_colour} relative grid grid-cols-12 gap-3 md:gap-5`}
		>
			{featured &&
				featured instanceof Array &&
				featured.map((category: Category, index) => {
					return (
						<div
							key={index}
							className="col-span-4 md:col-span-2 relative mb-0 mb-md-0 overflow-clip border border-border rounded-t]"
						>
							<Link
								href={`${process.env.BASE_URL}/archive?cat=${category.slug}`}
								className="category relative"
							>
								<Image
									alt={category.name}
									width={250}
									height={250}
									className="z-50 mb-0 object-cover"
									src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${category.image.url}`}
									priority={false}
								/>
							</Link>
							<SwiperText
								id={category.id}
								summary={category.description}
								path={category.slug}
								route={`${process.env.BASE_URL}/archive?cat=${category.slug}`}
								name={category.name}
							/>
						</div>
					);
				})}
		</div>
	);
}

function SwiperText({
	id,
	summary,
	path,
	route,
	name,
}: {
	id: number;
	summary: string;
	path: string;
	route: string;
	name: string;
}) {
	return (
		<div className="bottom-0 w-full mb-0 flex flex-col px-1 text-center md:py-1">
			<Link
				href={route}
				className="block text-sm md:text-base md:font-bold capitalize text-primary"
			>
				{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
			</Link>
			{/*<span className="text-base">{summary}</span>*/}
		</div>
	);
}
