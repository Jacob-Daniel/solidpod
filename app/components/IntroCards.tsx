import { InfoCard } from "@/lib/types";
import StaticIcon from "@/app/components/StaticIcon";

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
		<section
			id={id}
			className="col-span-12 md:col-span-6 lg:col-span-3 border border-gray-300 rounded p-5"
		>
			<div className="grid justify-items-center items-center xl:mb-0 m-auto flex flex-col bg-white">
				<h2 className="font-sans font-bold mb-1">{json.heading}</h2>
				<StaticIcon
					iconName={json.icon}
					color={icon_colour}
					className="text-xl mb-1 text-slate-600/40 block"
				/>

				<p
					className="leading-snug self-start text-center !p-0"
					dangerouslySetInnerHTML={{ __html: json.text }}
				/>
			</div>
		</section>
	);
}
