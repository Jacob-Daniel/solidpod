"use client";
import { MenuItem } from "@/lib/types";
import NavLink from "@/app/components/NavLink";
import NavSpan from "@/app/components/NavSpan";
import SubUl from "@/app/components/SubUl";

interface ILinks {
	type: string;
	link: MenuItem;
	data: MenuItem[];
}

export default function ListItem({ type, link, data }: ILinks) {
	const { id, slug, label, is_parent, is_button, server_slug } = link;

	return (
		<>
			<MenuItemType
				id={id}
				slug={slug}
				server_slug={server_slug}
				label={label}
				is_parent={is_parent}
				is_button={is_button}
				type={type}
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
	server_slug: string;
	slug: string;
	label: string;
	is_parent: boolean;
	is_button: boolean;
	type: string;
}

function MenuItemType({
	id,
	slug,
	server_slug,
	label,
	is_parent,
	is_button,
	type,
}: IMenuItemTypeProps) {
	return is_parent ? (
		<NavSpan
			type={type}
			id={id}
			slug={slug}
			label={label}
			is_button={is_button}
		/>
	) : (
		<NavLink
			type={type}
			slug={slug}
			label={label}
			is_button={is_button}
			server_slug={server_slug}
		/>
	);
}
