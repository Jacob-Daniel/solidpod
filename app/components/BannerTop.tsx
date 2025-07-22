import { Banner, Section } from "@/lib/types";
import ResponsiveImage from "@/app/components/ResponsiveImage";
import colors from "tailwindcss/colors";

export default function BannerTop({ banner }: { banner: Banner }) {
	return (
		<div className="col-span-12 relative mt-[0px] bg-gray-200">
			<div className="col-span-12 h-full">
				<div id="banner" className="relative z-10">
					<div className="w-full relative">
						<ResponsiveImage
							className="opacity-100 w-full object-fit"
							banner={banner.image_versions}
							alt={banner.heading}
							priority={true}
						/>
					</div>
				</div>
			</div>
			{/*			<div className="absolute z-50 bottom-2 lg:bottom-7 w-full grid grid-cols-12">
				<div className="relative col-span-12 px-5 lg:px-0  lg:col-start-2">
					<h3 className="font-quicksand mb-1 lg:mb-2 text-white font-heading font-extrabold text-2xl md:text-3xl lg:text-4xl text-white leading-none">
						{banner.heading}
					</h3>
					<span className="block text-sm md:text-md lg:text-xl text-white md:bg-none z-0">
						{banner.sub_heading}
					</span>
				</div>
			</div>*/}
		</div>
	);
}
