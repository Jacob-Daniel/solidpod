"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/NavigationContext"; // Import the context
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
	const active = slug === pathname ? "bg-yellow-300" : "";
	const { activeSubmenuId, closeSubmenu } = useNavigationContext();
	const url = `${process.env.BASE_URL}/${slug}`;
	// const url =
	// parentSlug && parentSlug
	// 	? `${process.env.BASE_URL}/${parentSlug}/${slug}`
	// 	: `${process.env.BASE_URL}/${slug}`;
	return (
		<Link
			className={`text-base font-bold align-bottom !hover:text-yellow-300 ${active} px-1`}
			href={url}
			onClick={(e) => {
				// e.preventDefault();
				setVisible(false);
				closeSubmenu();
				if (onClick) onClick(e);
			}}
		>
			{label}
		</Link>
	);
}
