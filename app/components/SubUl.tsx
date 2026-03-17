"use client";
import React from "react";
import SubLink from "@/app/components/SubLink";
import { MenuItem } from "@/lib/types";
import { useNavigationContext } from "@/lib/navigationContext";

interface ILinks {
	id: number;
	links: MenuItem[];
	parentSlug: string;
}

export default function SubUl({ id, links, parentSlug }: ILinks) {
	const { activeSubmenuId, closeSubmenu } = useNavigationContext();
	const isActive = id === activeSubmenuId;

	const handleSubLinkClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		closeSubmenu();
	};

	return (
		<ul
			className={`!z-50 mt-[5px] md:mt-0 md:absolute top-[55px] border border-border grid md:gap-x-5 items-center px-2 justify-center 
	${isActive ? "block md:block" : "block md:hidden"} 
	rounded py-1 bg-body`}
		>
			{links.map((link) => (
				<li className="flex justify-center" key={link.id}>
					<SubLink
						slug={link.slug}
						label={link.label}
						parentSlug={parentSlug}
						onClick={handleSubLinkClick}
					/>
				</li>
			))}
		</ul>
	);
}
