"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/navigationContext"; // Import the context
import { useVisibility } from "@/lib/VisibilityContext";

interface ILinks {
	id: number;
	slug: string;
	label: string;
	parentSlug: string;
	onClick?: (e: React.MouseEvent) => void; // Accept event as a parameter
}

export default function SubLink({
	id,
	slug,
	parentSlug,
	label,
	onClick,
}: ILinks) {
	const { setVisible } = useVisibility();
	const pathname = usePathname()!.slice(1);
	const active = slug === pathname ? "-2 border-indigo-300" : "";
	const { activeSubmenuId, closeSubmenu } = useNavigationContext();
	const url = `${process.env.BASE_URL}/${slug}`;
	// const url =
	// parentSlug && parentSlug
	// 	? `${process.env.BASE_URL}/${parentSlug}/${slug}`
	// 	: `${process.env.BASE_URL}/${slug}`;
	return (
		<Link
			className={`text-xl md:text-base font-bold align-bottom hover:text-hoverText ${active} mb-1 text-primary`}
			href={url}
			onClick={(e) => {
				setVisible(false);
				closeSubmenu();
				if (onClick) onClick(e);
			}}
		>
			{label}
		</Link>
	);
}
