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
			className="col-span-6 md:col-span-3 inline-block md:inline lg:col-span-3 border border-border hover:shadow-md hover:border-border hover:border-gray-400 rounded shadow shadow-shadow text-center"
		>
			<Link
				href={`${process.env.NEXT_PUBLIC_BASE_URL}/${json.slug.slug}`}
				className="whitespace-normal grid justify-items-center items-center xl:mb-0 m-auto flex flex-col border-border p-2 py-3 md:p-5"
			>
				<StaticIcon
					iconName={json.icon}
					color={icon_colour}
					className="text-xl mb-1 text-primary block"
				/>
				<h2 className="text-base font-sans font-bold mb-1 !text-primary">
					{json.heading}
				</h2>

				<p
					className="leading-snug self-start text-center !p-0 text-base text-primary"
					dangerouslySetInnerHTML={{ __html: json.text }}
				/>
			</Link>
		</div>
	);
}
