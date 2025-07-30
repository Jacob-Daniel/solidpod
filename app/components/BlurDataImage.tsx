import Image from "next/image";
export default function BlurServerImage({
	className,
	title,
	imageUrl,
	shadow = true,
	rounded = false,
	objectFit,
	width,
	height,
	priority = false,
	blurDataUrl,
}: {
	className: string;
	title: string;
	imageUrl: string;
	shadow: boolean;
	rounded: boolean;
	objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
	width: number;
	height: number;
	priority?: boolean;
	blurDataUrl: string;
}) {
	const imgurl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${imageUrl}`;
	return (
		<Image
			className={`mx-auto 
			${rounded && "rounded"}
			${shadow && "shadow-[5px_5px_7px_rgba(0,0,0,0.2)]"} ${className}`}
			alt={title}
			src={imgurl}
			width={width}
			height={height}
			placeholder="blur"
			blurDataURL={blurDataUrl}
			priority={priority}
		/>
	);
}
