"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { IImage } from "@/lib/types";

export default function BlurImage({
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
	const [blurDataURL, setBlurDataURL] = useState<string | undefined>();

	useEffect(() => {
		async function getBase64() {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${image.formats.thumbnail.url}`,
			);
			const blob = await res.blob();
			const reader = new FileReader();
			reader.onloadend = () => {
				setBlurDataURL(reader.result as string);
			};
			reader.readAsDataURL(blob);
		}

		getBase64();
	}, [image.formats.thumbnail.url]);

	const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${image.url}`;

	return (
		<Image
			className={`mx-auto 
				${rounded ? "rounded" : ""} 
				${shadow ? "shadow-[5px_5px_7px_rgba(0,0,0,0.2)]" : ""} 
				${className}`}
			alt={title}
			src={imageUrl}
			width={width}
			height={height}
			placeholder="blur"
			blurDataURL={blurDataURL || "data:image/svg+xml;base64,..."} // fallback if needed
			priority={priority}
			style={{ objectFit }}
		/>
	);
}
