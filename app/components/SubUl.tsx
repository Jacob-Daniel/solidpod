"use client";
import React, { useEffect, useState } from "react";
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
	const [display, setDisplay] = useState<string>("block md:hidden");
	useEffect(() => {
		if (id === activeSubmenuId) {
			setDisplay("block md:block");
		} else {
			setDisplay("block md:hidden");
		}
	}, [activeSubmenuId, id]);

	const handleSubLinkClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setDisplay("md:hidden");
		closeSubmenu();
	};

	return (
		<ul
			className={`!z-50 mt-[5px] md:mt-0 md:absolute top-[55px] border border-gray-300 grid md:gap-x-5 items-center py-0 px-2 justify-center ${display} rounded py-1 bg-gray-50 md:bg-white dark:bg-zinc-800 dark:border-zinc-700`}
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
