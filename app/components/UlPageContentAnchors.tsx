"use client";
import Link from "next/link";
// import { MenuItem, NavigationComponent } from "@/lib/types";
import { useScrollSpy } from "@/lib/clientFunctions";

type Tags = {
	label: string;
	target: string;
	fragment: string;
};
const UlPageContentAnchors = ({
	list,
	type,
	className,
	classNameLi,
	onNavItemClick,
	page,
}: {
	list: Tags[];
	type: string;
	className: string;
	classNameLi: string;
	onNavItemClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
	page?: string;
}) => {
	const tags: Tags[] =
		list.map((item) => ({
			fragment: item.fragment,
			label: item.label,
			target: item.target,
		})) ?? [];
	const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const targetId = e.currentTarget.dataset.target;
		if (!targetId) return;

		const targetEl = document.getElementById(targetId);
		if (targetEl) {
			targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};
	const activeId = useScrollSpy(tags.map(({ fragment }) => fragment));
	return (
		<ul className={`flex flex-col text-slate-800 ${className}`}>
			{tags &&
				tags instanceof Array &&
				tags.map((item, index) => (
					<li className={`${classNameLi}`} key={index}>
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
							{item.label.replaceAll("-", " ")}
						</Link>
					</li>
				))}
		</ul>
	);
};

export default UlPageContentAnchors;
