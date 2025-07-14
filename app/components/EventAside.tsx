import { Event, EventSidebar } from "@/lib/types";
import CompanyPlace from "@/app/components/CompanyPlace";
import SocialShareLinks from "@/app/components/SocialShareLinks";
export default function aside({
	className,
	sidebar,
	event,
}: {
	className: string;
	sidebar: EventSidebar;
	event: Event;
}) {
	if (!sidebar) return null;
	if (event && event.location) {
		const {
			location: { address, people },
		} = event;
		return (
			<aside className={className}>
				<div className="bg-gray-600 px-5  py-3 md:p-3 rounded-xl shadow-sm space-y-3 col-span-12 lg:col-span-3">
					<h2 className="font-sans text-xl font-bold mb-0">
						{sidebar?.heading}
					</h2>
					{event && address.address_line_1 && (
						<article className="text-sm text-gray-800">
							<h3 className="font-semibold">Address</h3>
							<CompanyPlace
								className="text-sm leading-4 text-white mb-2"
								address={address}
								person={people}
							/>
						</article>
					)}
					{sidebar.share?.message && (
						<p className="text-sm mb-0">{sidebar.share.message}</p>
					)}
					<SocialShareLinks
						url={event.slug}
						text={event.title}
						title={event.title}
					/>
				</div>
			</aside>
		);
	} else {
		return (
			<aside className="bg-gray-200 p-3 rounded-xl shadow-sm space-y-4 col-span-12 lg:col-span-3 px-5 md:px-0">
				details not found
			</aside>
		);
	}
}
