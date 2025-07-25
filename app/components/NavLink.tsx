"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/NavigationContext";
import { useVisibility } from "@/lib/VisibilityContext";

interface ILinks {
	slug: string;
	server_slug: string;
	label: string;
	onClick?: () => void;
	is_button: boolean;
}

const NavLink = ({ slug, label, onClick, is_button, server_slug }: ILinks) => {
	const { setVisible } = useVisibility();
	const pathname = usePathname()!.slice(1);
	const active = server_slug === pathname ? "!bg-yellow-300" : "";
	const { closeSubmenu } = useNavigationContext();
	const handleClick = () => {
		closeSubmenu;
		setVisible(false);
	};
	return (
		<Link
			data-link="link"
			className={`font-sans font-bold align-bottom hover:!text-yellow-300 ${active} p-1 ${is_button && "border !border-gray-400 px-2 pt-1 !pb-1 rounded"}`}
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
