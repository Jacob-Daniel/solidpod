"use client";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/NavigationContext"; // Import the context

interface ILinks {
	id: number;
	slug: string;
	label: string;
	is_button: boolean;
}

export default function NavSpan({ id, slug, label, is_button }: ILinks) {
	const pathname = usePathname()!.slice(1);
	const active = slug === pathname ? "text-yellow-500" : "";
	const { setActiveSubmenuId, activeSubmenuId } = useNavigationContext();
	const handleClick = () => {
		setActiveSubmenuId(activeSubmenuId === id ? null : id);
	};

	return (
		<span
			data-id={id}
			className={`font-sans font-bold hover:text-yellow-300 align-baseline pb-0
        ${active} cursor-pointer ${is_button && "border p-1"}`}
			onClick={handleClick}
		>
			{label}
		</span>
	);
}
