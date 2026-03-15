import Image from "next/image";
import { ImageVersion } from "@/lib/types";
import { shimmerBlur } from "@/lib/shimmer";

export default function ResponsiveImage({
	banner,
	className,
	alt,
	priority = true,
}: {
	banner: ImageVersion[];
	className: string;
	alt: string;
	priority?: boolean;
}) {
	const mobile = banner.find((b) => b.version === "mobile");
	const desktop = banner.find((b) => b.version === "desktop");

	if (!mobile && !desktop) return null;
	const altImage =
		desktop?.image.url ||
		mobile?.image.url ||
		(process.env.NEXT_PUBLIC_COMPANY_NAME as string);
	const mobileUrl = mobile
		? `${process.env.STRAPI_BASE_URL}${mobile.image.url}`
		: undefined;

	const desktopUrl = desktop
		? `${process.env.STRAPI_BASE_URL}${desktop.image.url}`
		: undefined;

	const blurDataURL = shimmerBlur(
		desktopUrl ? desktop?.image.width : mobile?.image.width,
		desktopUrl ? desktop?.image.height : mobile?.image.height,
	);
	return (
		<picture className="h-full">
			{mobileUrl && <source media="(max-width: 767px)" srcSet={mobileUrl} />}
			<Image
				className={className}
				alt={alt || altImage}
				src={desktopUrl || mobileUrl!}
				width={desktopUrl ? desktop?.image.width : mobile?.image.width}
				height={desktopUrl ? desktop?.image.height : mobile?.image.height}
				placeholder="blur"
				blurDataURL={blurDataURL}
				priority={priority}
			/>
		</picture>
	);
}
