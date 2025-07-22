import Image from "next/image";
import { ImageVersion } from "@/lib/types";

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

	const mobileUrl = mobile
		? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${mobile.image.url}`
		: undefined;

	const desktopUrl = desktop
		? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${desktop.image.url}`
		: undefined;

	const blurDataURL = desktop?.image.formats.thumbnail?.url
		? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${desktop.image.formats.thumbnail.url}`
		: undefined;
	return (
		<picture>
			{mobileUrl && <source media="(max-width: 600px)" srcSet={mobileUrl} />}
			{desktopUrl && <source media="(min-width: 601px)" srcSet={desktopUrl} />}
			<Image
				className={className}
				alt={alt}
				src={desktopUrl || mobileUrl!}
				width={desktop?.image.width}
				height={desktop?.image.height}
				placeholder={blurDataURL ? "blur" : undefined}
				blurDataURL={blurDataURL}
				priority={priority}
			/>
		</picture>
	);
}
