"use client";
// import { useState } from "react";
import Image from "next/image";
export default function BlurImage({
	className,
	title,
	sourceUrl,
	shadow = true,
	rounded = false,
	objectFit,
	width,
	height,
	priority = false,
}: {
	className: string;
	title: string;
	sourceUrl: string;
	shadow: boolean;
	rounded: boolean;
	objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
	width: number;
	height: number;
	priority?: boolean;
}) {
	const keyStr =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	const triplet = (e1: number, e2: number, e3: number) =>
		keyStr.charAt(e1 >> 2) +
		keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
		keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
		keyStr.charAt(e3 & 63);

	const rgbDataURL = (r: number, g: number, b: number) =>
		`data:image/gif;base64,R0lGODlhAQABAPAA${
			triplet(0, r, g) + triplet(b, 255, 255)
		}/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
	const styleHeight = objectFit === "cover" ? "100%" : "auto";
	return (
		<Image
			className={`mx-auto 
			${rounded && "rounded"}
			${shadow && "shadow-[5px_5px_7px_rgba(0,0,0,0.2)]"} ${className}`}
			alt={title}
			src={sourceUrl}
			sizes="(max-width: 280px) 280px,
           (max-width: 220px) 220px,
           (max-width: 280px) 280px,
           400px"
			width={width}
			height={height}
			// onLoad={(e) => handleOnLoad(e)}
			style={{
				objectFit: objectFit,
				width: "100%",
				height: styleHeight,
			}}
			placeholder="blur"
			blurDataURL={rgbDataURL(245, 245, 245)}
			priority={priority}
		/>
	);
}
