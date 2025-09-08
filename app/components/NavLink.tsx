"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/NavigationContext";
import { useVisibility } from "@/lib/VisibilityContext";
import LogoutButton from "@/app/solid/LogoutButton";
import LoginButton from "@/app/solid/LoginButton";
import { useSolidSession } from "@/lib/sessionContext";

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
	const { isLoggedIn, session } = useSolidSession();

	const { setVisible } = useVisibility();
	const pathname = usePathname()!.slice(1);
	const active =
		server_slug === pathname && type === "desktop"
			? "!border-b border-gray-300"
			: "";
	const { closeSubmenu } = useNavigationContext();
	const handleClick = () => {
		closeSubmenu;
		setVisible(false);
	};
	if (
		(slug === "logout" && type === "user") ||
		(slug === "login" && type === "desktop")
	) {
		return !isLoggedIn ? <LoginButton /> : <LogoutButton />;
	} else {
		return (
			<Link
				data-link="link"
				className={`text-base ${(type === "desktop" || type === "mobile") && "font-bold"} hover:text-black/75 font-sans ${active} ${is_button && "border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 rounded px-2 py-[5px]"} dark:text-white`}
				href={
					type === "user"
						? `${process.env.BASE_URL}/dashboard/${slug}`
						: `${process.env.BASE_URL}/${slug}`
				}
				onClick={(e) => {
					(handleClick(), onClick && onClick());
				}}
			>
				{label}
			</Link>
		);
	}
};

export default NavLink;
