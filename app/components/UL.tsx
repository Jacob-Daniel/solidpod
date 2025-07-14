import Link from "next/link";
import { MenuItem, NavigationComponent } from "@/lib/types";
const UL = ({
	menu,
	type,
	className,
	classNameLi,
	onNavItemClick,
}: {
	menu: NavigationComponent;
	type: string;
	className: string;
	classNameLi: string;
	onNavItemClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
	return (
		<ul className={`flex flex-col ${className}`}>
			{menu &&
				menu.navigation_menu.navigation_items instanceof Array &&
				menu.navigation_menu.navigation_items.map((item) => (
					<li className={`${classNameLi}`} key={item.id}>
						<Link
							onClick={onNavItemClick}
							href={
								item.target === "_self"
									? `${process.env.NEXT_PUBLIC_BASE_URL}/${item.slug === "home" ? "" : item.slug}`
									: item.slug
							}
							className={`hover:text-red-400 capitalize inline ${type === "main" ? "text-md" : "text-sm"}`}
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
