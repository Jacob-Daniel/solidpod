"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/navigationContext"; // Import the context
import { useVisibility } from "@/lib/VisibilityContext";

interface ILinks {
	slug: string;
	label: string;
	parentSlug: string;
	onClick?: (e: React.MouseEvent) => void;
}

export default function SubLink({ slug, label, parentSlug, onClick }: ILinks) {
	const { setVisible } = useVisibility();
	const { closeSubmenu } = useNavigationContext();

	const pathname = usePathname();
	const isActive = pathname.startsWith(`/${parentSlug}/${slug}`);
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`;

	return (
		<Link
			className={`text-xl md:text-base font-bold align-bottom hover:text-hoverText mb-1 text-primary ${
				isActive ? "border-b-2 border-indigo-300" : ""
			}`}
			href={url}
			onClick={(e) => {
				setVisible(false);
				closeSubmenu();
				onClick?.(e);
			}}
		>
			{label}
		</Link>
	);
}
