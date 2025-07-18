"use client";
import { usePathname } from "next/navigation";
import { useNavigationContext } from "@/lib/NavigationContext"; // Import the context

interface ILinks {
	id: number;
	slug: string;
	label: string;
	is_button: string;
}

export default function NavSpan({ id, slug, label }: ILinks) {
	const pathname = usePathname()!.slice(1);
	const active = slug === pathname ? "text-yellow-500" : "text-white";

	const { setActiveSubmenuId, activeSubmenuId } = useNavigationContext();

	const handleClick = () => {
		setActiveSubmenuId(activeSubmenuId === id ? null : id);
	};

	return (
		<span
			data-id={id}
			className={`font-open-sans font-extrabold hover:text-yellow-500 align-baseline text-lg pb-0
        ${active} cursor-pointer md:text-shadow md:shadow-black ${is_button && "border p-1"}`}
			onClick={handleClick}
		>
			{label}
		</span>
	);
}
