import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/NavigationContext";
import { useVisibility } from "@/lib/VisibilityContext";

interface ILinks {
	slug: string;
	label: string;
	onClick?: () => void;
	is_button: boolean;
}

const NavLink = ({ slug, label, onClick, is_button }: ILinks) => {
	const { setVisible } = useVisibility();
	const pathname = usePathname()!.slice(1);
	const active = slug === pathname ? "!text-yellow-500" : "";

	const { closeSubmenu } = useNavigationContext();
	const handleClick = () => {
		closeSubmenu;
		setVisible(false);
	};
	return (
		<Link
			data-link="link"
			className={`font-sans font-bold align-bottom hover:!text-yellow-500 ${active} pb-2 ${is_button && "border !border-gray-400 px-2 pt-1 !pb-1 rounded"}`}
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
