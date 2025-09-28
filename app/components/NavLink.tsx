"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/navigationContext";
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
			? "!-2 border-indigo-300"
			: "";
	const { closeSubmenu } = useNavigationContext();
	const handleClick = () => {
		closeSubmenu;
		setVisible(false);
	};
	if (
		(slug === "logout" && type === "user") ||
		(slug === "logout" && type === "desktop") ||
		(slug === "login" && type === "desktop")
	) {
		return !isLoggedIn ? <LoginButton /> : <LogoutButton />;
	} else {
		return (
			<Link
				data-link="link"
				className={`text-primary text-xl md:text-base ${(type === "desktop" || type === "mobile") && "font-bold"} hover:text-hoverText font-sans ${active} ${is_button && "border border-border rounded px-2 py-[5px]"} text-primary`}
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
