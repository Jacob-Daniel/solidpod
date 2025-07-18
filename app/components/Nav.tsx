// import { unstable_cacheTag as cacheTag } from "next/cache";

import NavModal from "@/app/components/NavModal";
import { MenuItem, INavigationItems } from "@/lib/types"; // Adjust path as needed
import List from "@/app/components/List";
import { getAPI } from "@/lib/functions";

export default async function Nav({ type }: { type: string }) {
	// "use cache";
	// cacheTag("home", "whats-on", "membership");
	const [nav] = await getAPI<INavigationItems[]>(
		"/navigations?filters[type][$eq]=main&populate[navigation_items][populate][children][sort]=order:asc&populate[navigation_items][populate][parent]=true&sort=navigation_items.order:desc",
	);
	return (
		<nav className="col-span-12 z-50 bg-transparent md:col-span-8 w-full grid grid-cols-12 justify-end md:align-middle px-5 md:h-[100px] md:items-center md:px-0">
			<List nav={nav} type="desktop" />
			<NavModal
				nav={nav}
				id="navModal"
				display="flex md:hidden absolute top-5 end-5"
			/>
		</nav>
	);
}
