"use client";
import Link from "next/link";
import { MenuItem, NavigationComponent } from "@/lib/types";
import { useScrollSpy } from "@/lib/clientFunctions";
const UlPageContent = ({
	menu,
	type,
	className,
	classNameLi,
	onNavItemClick,
	page,
}: {
	menu: NavigationComponent;
	type: string;
	className: string;
	classNameLi: string;
	onNavItemClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
	page?: string;
}) => {
	const tags: string[] =
		menu?.navigation_menu?.navigation_items
			?.map((item) => item.fragment)
			.filter((fragment): fragment is string => typeof fragment === "string") ??
		[];
	const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const targetId = e.currentTarget.dataset.target;
		if (!targetId) return;

		const targetEl = document.getElementById(targetId);
		if (targetEl) {
			targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};
	const activeId = useScrollSpy(tags);
	return (
		<ul className={`flex flex-col text-slate-800 ${className}`}>
			{menu &&
				menu.navigation_menu.navigation_items instanceof Array &&
				menu.navigation_menu.navigation_items.map((item) => (
					<li className={`${classNameLi}`} key={item.id}>
						<Link
							data-target={item.fragment}
							onClick={(e) => {
								onNavItemClick;
								handleScroll(e);
							}}
							href={`${process.env.NEXT_PUBLIC_BASE_URL}/${page}#${item.fragment}`}
							className={`cursor-pointer capitalize inline text-sm text-slate-800 ${activeId === item.fragment && "ps-0 !text-slate-500"}`}
							target={item.target}
						>
							{activeId === item.fragment && (
								<span className="bg-red-400 h-2 w-2 rounded-full inline-block">
									{" "}
								</span>
							)}{" "}
							{item.label}
						</Link>
					</li>
				))}
		</ul>
	);
};

export default UlPageContent;
