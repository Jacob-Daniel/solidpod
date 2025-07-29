import Image from "next/image";
import { ImageVersion } from "@/lib/types";
import { rgbDataURL } from "@/lib/functions";

export default async function ResponsiveImage({
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
		(process.env.COMPANY_NAME as string);
	const mobileUrl = mobile
		? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${mobile.image.url}`
		: undefined;

	const desktopUrl = desktop
		? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${desktop.image.url}`
		: undefined;
	const blurDataURL = desktop?.image.formats.thumbnail?.url
		? await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${desktop.image.formats.thumbnail.url}`,
			)
				.then((res) => res.arrayBuffer())
				.then(
					(buf) =>
						`data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`,
				)
		: rgbDataURL(245, 245, 245);
	return (
		<picture>
			{mobileUrl && <source media="(max-width: 600px)" srcSet={mobileUrl} />}
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
