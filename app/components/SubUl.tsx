"use client";
import React, { useEffect, useState } from "react";
import SubLink from "@/app/components/SubLink";
import { MenuItem } from "@/lib/types";
import { useNavigationContext } from "@/lib/NavigationContext";

interface ILinks {
	id: number;
	links: MenuItem[];
	parentSlug: string;
}

export default function SubUl({ id, links, parentSlug }: ILinks) {
	const { activeSubmenuId, closeSubmenu } = useNavigationContext();
	const [display, setDisplay] = useState<string>("hidden");
	useEffect(() => {
		if (id === activeSubmenuId) {
			setDisplay("block");
		} else {
			setDisplay("hidden");
		}
	}, [activeSubmenuId, id]);

	const handleSubLinkClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent bubbling
		setDisplay("hidden"); // Hide submenu
		closeSubmenu(); // Close submenu contextually
	};

	return (
		<ul
			className={`z-50 md:absolute top-[35px] border border-gray-400 grid md:gap-x-5 md:bg-white items-center py-0 px-2 justify-center ${display} rounded py-1`}
		>
			{links.map((link) => (
				<li className="flex justify-center" key={link.id}>
					<SubLink
						id={link.id}
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
