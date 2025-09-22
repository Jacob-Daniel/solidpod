import { InfoCard } from "@/lib/types";
import StaticIcon from "@/app/components/StaticIcon";
import Link from "next/link";
export default function Intros({
	json,
	id,
	pagination,
	route,
	path,
	icon_colour,
}: {
	json: InfoCard;
	id: string;
	pagination: string;
	route: string;
	path: string;
	icon_colour: string;
}) {
	return (
		<div
			id={id}
			className="col-span-6 md:col-span-3 inline-block md:inline lg:col-span-3 border border-gray-300 dark:border-zinc-800 hover:shadow-md hover:border-zinc-400 dark:hover:border-zinc-700 rounded dark:shadow-zinc-800 text-center"
		>
			<Link
				href={`${process.env.NEXT_PUBLIC_BASE_URL}/${json.slug.slug}`}
				className="whitespace-normal grid justify-items-center items-center xl:mb-0 m-auto flex flex-col dark:bg-inherit p-5"
			>
				<StaticIcon
					iconName={json.icon}
					color={icon_colour}
					className="text-xl mb-1 text-black/90 dark:text-white block"
				/>
				<h2 className="font-sans font-bold mb-1">{json.heading}</h2>

				<p
					className="leading-snug self-start text-center !p-0 text-base"
					dangerouslySetInnerHTML={{ __html: json.text }}
				/>
			</Link>
		</div>
	);
}
