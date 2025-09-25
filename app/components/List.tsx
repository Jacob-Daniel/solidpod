"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWindowListener } from "@/lib/clientFunctions";
import ListItem from "@/app/components/ListItem";
import { INavigationItems } from "@/lib/types";
import { useNavigationContext } from "@/lib/navigationContext";
import { useSolidSession } from "@/lib/sessionContext";
import { formatMenuItems } from "@/lib/formatMenuItems";

const List = ({
	nav,
	user,
	type,
}: {
	nav: INavigationItems;
	user: INavigationItems;
	type: string;
}) => {
	let items;
	const pathname = usePathname();
	const { isLoggedIn, fullName } = useSolidSession();
	const { setActiveSubmenuId, closeSubmenu, activeSubmenuId } =
		useNavigationContext();

	useWindowListener("click", closeSubmenu);
	useEffect(() => {}, [activeSubmenuId]);
	const isDashboard = pathname.startsWith("/dashboard");
	if (isDashboard && user) {
		items = formatMenuItems(user.navigation_items, {
			isLoggedIn,
			fullName,
		});
	} else {
		items = formatMenuItems(nav.navigation_items, {
			isLoggedIn,
			fullName,
		});
	}
	return (
		<ul
			className={`
  relative z-30 col-span-12 
  text-slate-800 align-middle justify-center 
  items-center gap-x-3
  md:flex md:justify-end
  ${
		isDashboard && type === "main"
			? "hidden md:block"
			: type === "main"
				? "hidden md:gap-x-5 xl:gap-x-7"
				: ""
	}
`}
		>
			{items
				.filter((i) =>
					!isDashboard ? i.slug !== "logout" : i.slug === "logout",
				)
				.map((item) => (
					<li
						key={item.id}
						data-id={item.id}
						className={`md:z-30 justify-center align-baseline text-center capitalize transition-opacity mb-3 md:mb-0 ${
							item.is_parent ? "flex-col flex md:flex md:flex-row" : ""
						}`}
						onClick={(e) => {
							e.stopPropagation();
							setActiveSubmenuId(item.id);
						}}
					>
						<ListItem
							type={isDashboard ? "user" : "desktop"}
							link={item}
							data={item.children || []}
						/>
					</li>
				))}
		</ul>
	);
};

export default List;
