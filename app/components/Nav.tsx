import NavModal from "@/app/components/NavModal";
import { MenuItem, INavigationItems } from "@/lib/types"; // Adjust path as needed
import List from "@/app/components/List";
import { getAPI } from "@/lib/functions";

async function fetchMainNav() {
	return await getAPI<INavigationItems[]>(
		"/navigations?filters[type][$eq]=main&populate[navigation_items][populate][children][sort]=order:asc&populate[navigation_items][populate][parent]=true&sort=navigation_items.order:desc",
	);
}

async function fetchUserNav() {
	return await getAPI<INavigationItems[]>(
		"/navigations?filters[type][$eq]=user&populate[navigation_items][populate][children][sort]=order:asc&populate[navigation_items][populate][parent]=true&sort=navigation_items.order:desc",
	);
}

export default async function Nav({ type }: { type: string }) {
	const [[nav], [user]] = await Promise.all([fetchMainNav(), fetchUserNav()]);

	const combinded = {
		...nav,
		navigation_items: [...nav.navigation_items, ...user.navigation_items],
	};

	return (
		<nav className="col-span-12 z-40 md:col-span-8 md:flex md:gap-x-7 md:h-[70px] justify-end md:px-0 text-slate-800">
			<List nav={nav} user={user} />
			<NavModal
				id="navModal"
				nav={combinded}
				display="flex md:hidden absolute top-5 end-5"
			/>
		</nav>
	);
}
