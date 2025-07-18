"use client";
import { useEffect, useState } from "react";
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
	height?: number;
	width?: number;
	priority?: boolean;
}) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Set initial value
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 600);
		};

		handleResize(); // run on mount
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const desktop = banner.find((b) => b.version === "desktop");
	const mobile = banner.find((b) => b.version === "mobile");

	const selected = isMobile ? mobile : desktop;

	if (!selected) return null;

	const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${selected.image.url}`;
	const blurDataURL = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${selected.image.formats.thumbnail.url}`;

	return (
		<Image
			className={className}
			alt={alt || (selected.image.url as string)}
			src={imageUrl}
			placeholder="blur"
			blurDataURL={blurDataURL}
			width={selected.image.width}
			height={selected.image.height}
			style={{ objectFit: "" }}
			priority={priority}
		/>
	);
}
