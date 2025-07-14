import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";
import {
	Address,
	Person,
	SocialMedia,
	SharedSEO,
	General,
	Geo,
	MenuItem,
	INavigationItems,
} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertToEmbedUrl(url: string) {
	const youtubeRegex =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(youtubeRegex);

	if (match && match[1]) {
		return `https://www.youtube.com/embed/${match[1]}?autohide=0&cc_load_policy=1&modestbranding=1&fs=1&showinfo=0&rel=0&iv_load_policy=3&mute=0&loop=1`;
	}

	return url; // If it's not a YouTube URL, return the original URL
}
const url = new URL(process.env.BASE_URL as string);
export const siteMetadata = ({
	address,
	contact,
	social,
	geolocation,
	general,
	seo,
}: {
	address?: Address;
	contact?: Person[];
	social: SocialMedia[];
	geolocation?: Geo;
	general?: General;
	seo: SharedSEO;
}): Metadata => ({
	metadataBase: "https://mg.jacobdaniel.co.uk" as unknown as URL,
	title: {
		default: general?.title || "",
		template: `${general?.title} %s`,
	},
	description: general?.tagline || "",
	keywords: seo?.keywords?.split(",").map((keyword) => keyword.trim()),
	openGraph: {
		type: "website",
		title: general?.title,
		description: general?.tagline,
		images: {
			url: general?.image?.url || "", // Fallback to empty string if no image
			width: general?.image?.width || 1200, // Default width
			height: general?.image?.height || 630, // Default height
			alt: general?.title,
		},
		url:
			general?.slug === "/"
				? process.env.BASE_URL
				: `${process.env.BASE_URL}/${general?.slug}`,
		locale: "en_GB",
		countryName: "Great Britain",
	},
	category: "Local Campaigns", // Add default categories

	twitter: {
		card: "summary_large_image",
		title: general?.title,
		description: general?.tagline,
		images: {
			url: general?.image?.url || "", // Fallback to empty string
			width: general?.image?.width || 1200,
			height: general?.image?.height || 630,
			alt: general?.title,
		},
		creator: social?.[0]?.handle || "@default_handle", // Fallback to default handle
	},
	robots: {
		index: true,
		follow: true,
	},

	alternates: {
		canonical:
			general?.slug === "/"
				? process.env.BASE_URL
				: `${process.env.BASE_URL}/${general?.slug}`,
	},
	classification: "Local Democracy",
	// structuredData: geolocation
	// 	? {
	// 			"@context": "https://schema.org",
	// 			"@type": "Company", // or another appropriate type
	// 			name: general.title,
	// 			description: general.tagline,
	// 			url: `${process.env.BASE_URL}/${general.slug}`,
	// 			address: {
	// 				"@type": "PostalAddress",
	// 				streetAddress: address.address_line_1,
	// 				addressLocality: address.address_line_2,
	// 				addressRegion: address.county,
	// 				postalCode: address.postcode,
	// 				addressCountry: "UK",
	// 			},
	// 			telephone: contact.phone || undefined,
	// 			geo: {
	// 				latitude: geolocation.latitude,
	// 				longitude: geolocation.longitude,
	// 			},
	// 			image: general?.image?.url || "",
	// 			priceRange: seo.seo_priceRange || "N/A",
	// 			keywords: seo.seo_key_words.split(","),
	// 		}
	// 	: undefined,
});

export function formatDate(
	date: Date | undefined | null,
	abbrMonth: boolean = false,
	abbrYear: boolean = false,
): string {
	if (!date) {
		return "Invalid Date";
	}

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	let hours = date.getHours();
	let minutes = date.getMinutes();
	const month = abbrMonth
		? monthNames[date.getMonth()].substring(0, 3)
		: monthNames[date.getMonth()];
	const day = dayNames[date.getDay()];
	const ampm = hours >= 12 ? "pm" : "am";

	hours = hours % 12 || 12;
	const formattedHours = hours.toString().padStart(2, "0");
	const formattedMinutes = minutes.toString().padStart(2, "0");

	const strTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

	const year = abbrYear
		? "'" + (date.getFullYear() % 100).toString().padStart(2, "0")
		: date.getFullYear().toString();

	return `${day} ${date.getDate()} ${month} ${year}`;
}

export const buildMenu = (menuItems: INavigationItems): MenuItem[] => {
	const menuMap: { [key: number]: MenuItem } = {};

	const { navigation_items } = menuItems;
	navigation_items.forEach((item) => {
		menuMap[item.id] = { ...item, children: [] };
	});

	const menuTree: MenuItem[] = [];

	navigation_items.forEach((item) => {
		const hasParent = !!item?.parent?.id;
		const isTopLevel = item.is_parent || !hasParent;

		if (isTopLevel) {
			menuTree.push(menuMap[item.id]);
		} else {
			const parent = menuMap[Number(item?.parent?.id)];
			if (parent) {
				parent.children.push(menuMap[item.id]);
			}
		}
	});

	return menuTree;
};
