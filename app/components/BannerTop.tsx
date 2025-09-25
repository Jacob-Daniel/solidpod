import { Banner, Section } from "@/lib/types";
import ResponsiveImage from "@/app/components/ResponsiveImage";
import SVG from "@/app/components/SVG";
import paths from "@/public/svg/paths.json";
import Image from "next/image";
export default function BannerTop({
	banner,
	blurDataUrl,
}: {
	banner: Banner;
	blurDataUrl: string;
}) {
	const bg = banner.bg_colour;
	return (
		<div className="col-span-12 px-5 lg:px-0 md:max-h-[350px] hd:max-h-[390px]">
			<div
				className={`col-span-12 relative bg-[${bg}] dark:border dark:border-zinc-800 overflow-hidden md:max-h-[350px] hd:max-h-[390px]`}
			>
				<div className="col-span-12">
					<div className="relative flex items-end justify-end overflow-hidden md:max-h-[350px] hd:max-h-[390px]">
						<SVG
							className="hidden md:block lg:hidden absolute h-full inset-x-0 bottom-0 z-20"
							viewBox={paths.bannerSolidTablet.viewBox}
							preserveAspectRatio="xMidYMid meet"
							path={paths.bannerSolidTablet.path}
							gradientId="bannerSolidTablet"
							gradientColors={[{ offset: "0%", color: "#202542", opacity: 1 }]}
						/>
						<SVG
							className="hidden lg:block absolute h-full inset-x-0 bottom-0 z-20"
							viewBox={paths.bannerSolid.viewBox}
							preserveAspectRatio="xMidYMid meet"
							path={paths.bannerSolid.path}
							gradientId="bannerSolid"
							gradientColors={[{ offset: "0%", color: "#202542", opacity: 1 }]}
						/>
						{/*two divs to handle responsive bg*/}
						<div
							style={{ backgroundColor: bg }}
							className="w-full items-center justify-end md:flex hidden aspect-[1/1] md:aspect-auto md:max-h-[350px] hd:max-h-[390px]"
						>
							<ResponsiveImage
								className="object-contain"
								banner={banner.image_versions}
								alt={banner.heading}
								priority={true}
								blurDataUrl={blurDataUrl}
							/>
						</div>
						<div className="w-full items-center justify-end md:hidden flex aspect-[1/1] md:aspect-auto md:max-h-[350px] hd:max-h-[390px]">
							<ResponsiveImage
								className="object-contain"
								banner={banner.image_versions}
								alt={banner.heading}
								priority={true}
								blurDataUrl={blurDataUrl}
							/>
						</div>{" "}
					</div>
					<div
						className={`absolute z-30 inset-x-0 bottom-0 top-0 w-full flex items-center justify-start px-10 overflow-hidden bg-black/60 md:bg-transparent md:max-h-[350px] hd:max-h-[390px]`}
					>
						<div className="relative flex flex-col gap-2 items-center text-center max-w-lg pl-0 md:pl-0 md:pr-45 lg:pr-16">
							<Image
								src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/uploads/14262490_0a196e3b2b.webp`}
								alt="Solid Logo"
								width={80} // adjust size
								height={80} // adjust size
								className="animate-fade-in md:h-[60px] md:w-[60px] lg:w-[80px] lg:h-[80px]"
							/>
							<blockquote className="relativeitalic text-gray-700 before:content-['“'] before:absolute before:left-0 before:top-15 before:start- before:text-6xl before:text-white md:before:text-gray-400/20">
								<h2 className="animate-slide-in-lr font-quicksand mb-0 !text-white font-heading font-extrabold text-lg md:text-md lg:text-lg leading-none">
									{banner.heading}
								</h2>
								<span className="leading-none font-bold text-lg md:text-md lg:text-lg text-white md:font-extralight animate-slide-in-bt ">
									{banner.sub_heading}
								</span>
							</blockquote>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
