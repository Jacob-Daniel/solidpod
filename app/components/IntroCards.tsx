"use client";
import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as FarIcons from "react-icons/fa"; // React Icons doesn't separate regular
import * as FabIcons from "react-icons/fa"; // Brands are mostly included under `fa`
import * as GiIcons from "react-icons/gi";
import * as PiIcons from "react-icons/pi";
import * as LiaIcons from "react-icons/lia";
import type { IconType } from "react-icons"; // Ensure this is imported
import { InfoCard } from "@/lib/types";

type IconPrefix = "fas" | "far" | "fab"; // Solid, Regular, Brand
type IconName = string;
type IconData = [string, string]; // [text, "fas fa-child"]
type IconsJson = IconData[];

const convertToComponentName = (iconName: string): string => {
	return (
		"Fa" +
		iconName
			.replace(/^fa-/, "")
			.split("-")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join("")
	);
};

const getReactIcon = (componentName: string) => {
	if (FaIcons[componentName as keyof typeof FaIcons]) {
		return FaIcons[componentName as keyof typeof FaIcons];
	}
	if (FarIcons[componentName as keyof typeof FarIcons]) {
		return FarIcons[componentName as keyof typeof FarIcons];
	}
	if (FabIcons[componentName as keyof typeof FabIcons]) {
		return FabIcons[componentName as keyof typeof FabIcons];
	}
	return null;
};

export default function Intros({
	json,
	id,
	pagination,
	route,
	path,
	icon_colour,
}: {
	json: InfoCard;
	id: string;
	pagination: string;
	route: string;
	path: string;
	icon_colour: string;
}) {
	const IconComponent: IconType | null = getReactIcon(json.icon);

	return (
		<section
			id={id}
			className="col-span-12 md:col-span-6 lg:col-span-3 border border-gray-300 rounded p-5"
		>
			<div className="grid justify-items-center items-center xl:mb-0 m-auto flex flex-col bg-white">
				<h2 className="font-sans font-bold mb-1">{json.heading}</h2>
				{IconComponent && (
					<IconComponent
						style={{ color: icon_colour }}
						className={`text-xl mb-1 text-slate-600/40 block`}
						data-swiper-parallax="-300"
					/>
				)}

				<p
					className="leading-snug self-start text-center !p-0"
					dangerouslySetInnerHTML={{ __html: json.text }}
				/>
			</div>
		</section>
	);
}
