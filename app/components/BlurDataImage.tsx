import Image from "next/image";
import type { IImage } from "@/lib/types";
export default async function BlurImage({
	className,
	title,
	image,
	shadow = true,
	rounded = false,
	objectFit,
	width,
	height,
	priority = false,
}: {
	className: string;
	title: string;
	image: IImage;
	shadow: boolean;
	rounded: boolean;
	objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
	width: number;
	height: number;
	priority?: boolean;
}) {
	const blurDataURL = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${image.formats.thumbnail.url}`,
	)
		.then((res) => res.arrayBuffer())
		.then(
			(buf) => `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`,
		);

	const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${image.url}`;
	return (
		<Image
			className={`mx-auto 
			${rounded && "rounded"}
			${shadow && "shadow-[5px_5px_7px_rgba(0,0,0,0.2)]"} ${className}`}
			alt={title}
			src={imageUrl}
			width={width}
			height={height}
			placeholder="blur"
			blurDataURL={blurDataURL}
			priority={priority}
		/>
	);
}
