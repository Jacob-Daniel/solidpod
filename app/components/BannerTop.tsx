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
	return (
		<div className="col-span-12 relative mt-[0px] bg-gray-200 dark:border dark:border-zinc-800 overflow-hidden">
			<div className="col-span-12 h-full">
				<div id="banner" className="relative z-10">
					<div className="w-full relative flex items-end justify-end max-h-[350px] overflow-hidden">
						<SVG
							className="hidden md:block absolute w-full h-auto inset-x-0 bottom-0 z-30"
							viewBox={paths.bannerSolid.viewBox}
							preserveAspectRatio="xMidYMid meet"
							path={paths.bannerSolid.path}
							gradientId="bannerSolid"
							gradientColors={[{ offset: "0%", color: "#202542", opacity: 1 }]}
						/>
						<ResponsiveImage
							className="object-cover object-top h-full w-full max-h-[500px]"
							banner={banner.image_versions}
							alt={banner.heading}
							priority={true}
							blurDataUrl={blurDataUrl}
						/>
					</div>
				</div>
				<div className="absolute z-30 inset-x-0 bottom-0 top-5 w-full flex items-center justify-start px-10 overflow-hidden">
					<div className="relative flex flex-col gap-2 items-center text-center max-w-lg px-4">
						<Image
							src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/uploads/14262490_0a196e3b2b.webp`}
							alt="Solid Logo"
							width={80} // adjust size
							height={80} // adjust size
							className="animate-fade-in"
						/>
						<h2 className="font-quicksand mb-0 !text-white font-heading font-extrabold text-md lg:text-lg leading-none animate-slide-in-lr">
							{banner.heading}
						</h2>
						<span className="text-md lg:text-lg text-white font-extralight lowercase animate-slide-in animate-slide-in-tb">
							{banner.sub_heading}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
