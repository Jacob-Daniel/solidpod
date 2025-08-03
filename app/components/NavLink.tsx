"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/NavigationContext";
import { useVisibility } from "@/lib/VisibilityContext";

interface ILinks {
	type: string;
	slug: string;
	server_slug: string;
	label: string;
	onClick?: () => void;
	is_button: boolean;
}

const NavLink = ({
	type,
	slug,
	label,
	onClick,
	is_button,
	server_slug,
}: ILinks) => {
	const { setVisible } = useVisibility();
	const pathname = usePathname()!.slice(1);
	const active =
		server_slug === pathname && type === "desktop" ? "!text-blue-600" : "";
	const { closeSubmenu } = useNavigationContext();
	const handleClick = () => {
		closeSubmenu;
		setVisible(false);
	};
	return (
		<Link
			data-link="link"
			className={`text-base ${(type === "desktop" || type === "mobile") && "font-bold"} hover:text-black/75 font-sans align-bottom ${active} ${is_button && "border border-gray-300 dark:border-zinc-500 rounded px-2 py-[5px]"} dark:text-white`}
			href={`${process.env.BASE_URL}/${slug}`}
			onClick={(e) => {
				(handleClick(), onClick && onClick());
			}}
		>
			{label}
		</Link>
	);
};

export default NavLink;
