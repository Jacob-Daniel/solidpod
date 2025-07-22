import { Banner, Section } from "@/lib/types";
import ResponsiveImage from "@/app/components/ResponsiveImage";

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
		</div>
	);
}
