"use client";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/navigationContext"; // Import the context

interface ILinks {
	type: string;
	id: number;
	slug: string;
	label: string;
	is_button: boolean;
}

export default function NavSpan({ type, id, slug, label, is_button }: ILinks) {
	const pathname = usePathname()!.slice(1);
	const active = slug === pathname ? "text-yellow-500" : "";
	const { setActiveSubmenuId, activeSubmenuId } = useNavigationContext();
	const handleClick = () => {
		setActiveSubmenuId(activeSubmenuId === id ? null : id);
	};

	return (
		<span
			data-id={id}
			className={` ${(type === "desktop" || type === "mobile") && "font-bold"} hover:text-black/75 text-base font-sans align-baseline
        ${active} cursor-pointer ${is_button && "border px-1"} dark:text-white`}
			onClick={handleClick}
		>
			{label}
		</span>
	);
}
