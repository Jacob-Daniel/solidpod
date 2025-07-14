import { LayoutSidebar } from "@/lib/types";
// import RichPageContentRender from "@/app/components/RichPageContentRender";
import BlurImage from "@/app/components/BlurImage";
export default function aside({
	sidebar,
	className,
}: {
	sidebar: LayoutSidebar;
	className: string;
}) {
	const place = sidebar?.place;

	if (!place) return null;

	const { address, managing_organisation, events, slug } = place;
	const upcomingEvent = events && events.length > 0 ? events[0] : null;
	return (
		<aside className="bg-gray-200 p-3 rounded-xl shadow-sm space-y-4 col-span-12 md:col-span-4">
			<h2 className="text-xl font-extrabold mb-0">{sidebar.heading}</h2>
			<p className="text-sm text-gray-700">{sidebar.place.name}</p>

			<div className="text-sm text-gray-800">
				<h3 className="font-semibold mt-4">Address</h3>
				<p>
					{address.address_line_1 && (
						<>
							{address.address_line_1},<br />
						</>
					)}
					{address.address_line_2 && (
						<>
							{address.address_line_2},<br />
						</>
					)}
					{address.address_line_3 && (
						<>
							{address.address_line_3},<br />
						</>
					)}
					{/*{address.town && <>{address.town}, </>}*/}
					{address.postcode}
				</p>
			</div>

			{managing_organisation && (
				<div className="text-sm">
					<h3 className="font-semibold mt-4">Managed by</h3>
					<a
						href={`${process.env.BASE_URL}/${slug}`}
						className="text-blue-600 underline"
					>
						{managing_organisation.name}
					</a>
				</div>
			)}

			{upcomingEvent && (
				<div className="text-sm text-start flex flex-col gap-y-3">
					<h3 className="font-semibold">Upcoming Event</h3>
					<a
						href={`/events/${upcomingEvent.slug}`}
						className="text-blue-600 underline"
					>
						<BlurImage
							width={300}
							height={300}
							className="p-0"
							objectFit="cover"
							rounded={false}
							shadow={false}
							sourceUrl={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${upcomingEvent.image.url}`}
							title=""
							key={0}
							priority={false}
						/>
					</a>
				</div>
			)}
		</aside>
	);
}
