import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/NavigationContext";
import { useVisibility } from "@/lib/VisibilityContext";

interface ILinks {
	slug: string;
	label: string;
	onClick?: () => void;
}

const NavLink = ({ slug, label, onClick }: ILinks) => {
	const { setVisible } = useVisibility();
	const pathname = usePathname()!.slice(1);
	const active = slug === pathname ? "text-yellow-500" : "text-black";

	const { closeSubmenu } = useNavigationContext();
	const handleClick = () => {
		closeSubmenu;
		setVisible(false);
	};
	return (
		<Link
			data-link="link"
			className={`font-open-sans font-extrabold text-lg align-bottom hover:text-yellow-500 ${active} pb-2`}
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
