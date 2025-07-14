"use client";
import { MenuItem } from "@/lib/types";
import NavLink from "@/app/components/NavLink";
import NavSpan from "@/app/components/NavSpan";
import SubUl from "@/app/components/SubUl";

interface ILinks {
	link: MenuItem;
	data: MenuItem[];
}

export default function ListItem({ link, data }: ILinks) {
	const { id, slug, label, is_parent } = link;
	// console.log(slug, "slug");
	const parent = "";
	return (
		<>
			<MenuItemType
				id={id}
				slug={slug}
				label={label}
				is_parent={is_parent}
				parent={parent}
			/>
			{is_parent && <SubUlType id={id} links={data} parentSlug={slug} />}
		</>
	);
}

interface ISubUlTypeProps {
	id: number;
	links: MenuItem[];
	parentSlug: string;
}

function SubUlType({ id, links, parentSlug }: ISubUlTypeProps) {
	if (links.length === 0) return null;

	return <SubUl id={id} links={links} parentSlug={parentSlug} />;
}

interface IMenuItemTypeProps {
	id: number;
	slug: string;
	label: string;
	is_parent: boolean;
	parent: string;
}

function MenuItemType({
	id,
	slug,
	label,
	is_parent,
	parent,
}: IMenuItemTypeProps) {
	return is_parent ? (
		<NavSpan id={id} slug={slug} label={label} />
	) : (
		<NavLink slug={slug} label={label} parent={parent} />
	);
}
