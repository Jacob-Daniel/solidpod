import Link from "next/link";
import { MenuItem, NavigationComponent } from "@/lib/types";
const UL = ({
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
	return (
		<ul className={`flex flex-col text-slate-800 ${className}`}>
			{menu &&
				type !== "sidebar" &&
				menu.navigation_menu.navigation_items instanceof Array &&
				menu.navigation_menu.navigation_items.map((item) => (
					<li className={`${classNameLi} text-primary`} key={item.id}>
						<Link
							onClick={onNavItemClick}
							href={
								item.target === "_self"
									? `${process.env.NEXT_PUBLIC_BASE_URL}/${item.slug === "home" ? "" : item.slug}`
									: item.url
							}
							className={`hover: hover:border-gray-400 first-letter:uppercase inline ${type === "main" ? "text-xl" : "text-sm"}`}
							target={item.target}
						>
							{item.label}
						</Link>
					</li>
				))}
		</ul>
	);
};

export default UL;
