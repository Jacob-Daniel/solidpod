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
	const active = slug === pathname ? "text-yellow-500" : "text-white";
	const { activeSubmenuId, closeSubmenu } = useNavigationContext();
	const url = `${process.env.BASE_URL}/${slug}`;
	// const url =
	// parentSlug && parentSlug
	// 	? `${process.env.BASE_URL}/${parentSlug}/${slug}`
	// 	: `${process.env.BASE_URL}/${slug}`;
	return (
		<Link
			className={`md:text-shadow md:shadow-black font-bold align-bottom hover:text-yellow-500 text-md md:text-md ${active}`}
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
