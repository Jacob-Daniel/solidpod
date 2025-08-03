import { Banner, Section } from "@/lib/types";
import ResponsiveImage from "@/app/components/ResponsiveImage";

export default function BannerTop({
	banner,
	blurDataUrl,
}: {
	banner: Banner;
	blurDataUrl: string;
}) {
	return (
		<div className="col-span-12 relative mt-[0px] bg-gray-200 dark:border dark:border-zinc-500">
			<div className="col-span-12 h-full">
				<div id="banner" className="relative z-10">
					<div className="w-full relative">
						<ResponsiveImage
							className="opacity-100 w-full object-fit"
							banner={banner.image_versions}
							alt={banner.heading}
							priority={true}
							blurDataUrl={blurDataUrl}
						/>
					</div>
				</div>
				<div className="absolute z-30 bottom-0 top-0 w-full h-full bg-slate-800/60 flex items-center justify-center">
					<div className="relative flex flex-col md:flex-row gap-x-2 items-baseline">
						<h2 className="inline font-quicksand mb-0 text-white font-heading font-extrabold text-4xl lg:text-5xl !text-white leading-none animate-slide-in-lr">
							{banner.heading}
						</h2>
						<span className="text-3xl lg:text-4xl text-white md:bg-none z-0 font-extralight lowercase animate-slide-in animate-slide-in-tb">
							{banner.sub_heading}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
