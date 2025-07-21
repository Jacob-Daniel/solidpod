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
	const { id, slug, label, is_parent, is_button } = link;
	// console.log(slug, "slug", data, "data", is_parent, "parent");

	const parent = "";
	return (
		<>
			<MenuItemType
				id={id}
				slug={slug}
				label={label}
				is_parent={is_parent}
				parent={parent}
				is_button={is_button}
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
	parent: boolean;
	is_button: boolean;
}

function MenuItemType({
	id,
	slug,
	label,
	is_parent,
	parent,
	is_button,
}: IMenuItemTypeProps) {
	return is_parent ? (
		<NavSpan id={id} slug={slug} label={label} is_button={is_button} />
	) : (
		<NavLink slug={slug} label={label} parent={parent} is_button={is_button} />
	);
}
