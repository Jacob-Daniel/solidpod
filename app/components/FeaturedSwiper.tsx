"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Link from "next/link";
import ShowDate from "@/app/components/ShowDate";
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
		<section className={`${section.bg_colour} relative`}>
			<Swiper
				className=""
				modules={[Pagination]}
				spaceBetween={gap}
				pagination={{
					el: ".swiper-pagination",
					clickable: true,
					renderBullet: (index, className) => {
						return '<span class="' + className + '"></span>';
					},
				}}
				slidesPerView={view}
				breakpoints={{
					576: {
						spaceBetween: 30,
						slidesPerView: 2,
					},
					768: {
						slidesPerView: 3,
					},
					1024: {
						slidesPerView: 5,
						spaceBetween: 40,
					},
				}}
			>
				{featured &&
					featured instanceof Array &&
					featured.map((category: Category, index) => {
						return (
							<SwiperSlide
								key={index}
								className="relative mb-0 mb-md-0 overflow-clip border border-gray-300 dark:border-zinc-800 rounded-t min-h-[200px]"
							>
								<Link
									href={`${process.env.BASE_URL}/archive?cat=${category.slug}`}
									className="category relative"
								>
									<Image
										alt={category.name}
										width={200}
										height={200}
										className="z-50 mb-0"
										src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${category.image.url}`}
										objectFit="cover"
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
	name,
}: {
	id: number;
	summary: string;
	path: string;
	route: string;
	name: string;
}) {
	return (
		<div className="bottom-0 w-full mb-0 flex flex-col px-2 text-center dark:bg-zinc-600 py-1">
			<Link href={route} className="block link text-base font-bold capitalize">
				{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
			</Link>
			{/*<span className="text-base">{summary}</span>*/}
		</div>
	);
}
