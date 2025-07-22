"use client";
import React, { useEffect } from "react";
import { useWindowListener } from "@/lib/clientFunctions";
import ListItem from "@/app/components/ListItem";
import { MenuItem, INavigationItems, Session } from "@/lib/types";
import { useNavigationContext } from "@/lib/NavigationContext";
import { useSession } from "next-auth/react";

const List = ({ nav, type }: { nav: INavigationItems; type: string }) => {
	const { data: session } = useSession();
	const isLoggedIn = session && session.user;
	const { setActiveSubmenuId, closeSubmenu, activeSubmenuId } =
		useNavigationContext();

	useWindowListener("click", closeSubmenu);

	useEffect(() => {}, [activeSubmenuId]);

	const handleMenuItemClick = (id: number) => {
		setActiveSubmenuId(id);
	};

	const formatMenuItems = (items: MenuItem[]) => {
		return (
			items &&
			items instanceof Array &&
			items
				.filter((item) => !item.parent)
				.map((item) => {
					// replace "Login" with "Logout" dynamically
					const isLoginItem = item.label.toLowerCase() === "login";
					const isMyPetitions = item.slug.toLowerCase() === "my-petitions";
					const userDisplayName = session?.user?.name || "My Petitions";

					const modifiedItem = {
						...item,
						slug: isLoginItem && isLoggedIn ? "/logout" : item.slug,
						label:
							isLoginItem && isLoggedIn
								? "Logout"
								: isMyPetitions && isLoggedIn
									? userDisplayName
									: item.label,
					};
					if (isMyPetitions && !isLoggedIn) return null;
					return (
						<li
							key={modifiedItem.id}
							data-id={modifiedItem.id}
							className={`md:z-30 justify-center align-baseline text-center capitalize transition-opacity mb-3 md:mb-0 ${
								modifiedItem.is_parent
									? "flex-col flex md:flex md:flex-row"
									: ""
							}`}
							onClick={(e) => {
								e.stopPropagation();
								handleMenuItemClick(modifiedItem.id);
							}}
						>
							<ListItem
								link={modifiedItem}
								data={modifiedItem.children || []}
							/>
						</li>
					);
				})
		);
	};

	return (
		<ul
			className={`relative text-slate-800 z-30 col-span-12 grid-cols-12
        align-middle justify-center md:justify-end md:flex items-center gap-x-3 md:gap-x-7 lg:gap-x-7 xl:gap-x-10 ${type === "desktop" ? "hidden" : "md:block"}`}
		>
			{formatMenuItems(nav.navigation_items)}
			{/*<SearchModal id="navbarSearchModal" display="hidden md:flex" />*/}
		</ul>
	);
};

export default List;
