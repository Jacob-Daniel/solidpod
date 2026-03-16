import {
	Files,
	CreateMembership,
	CreateMembershipResponseAction,
	Meta,
} from "@/lib/types";

export async function getFiles(name: string): Promise<Files> {
	const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/file-system/folder?path=${name}`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_ADMIN_API_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch Files");
	const data: Files = await res.json();
	return data;
}

export async function getAPI<T>(query: string): Promise<T> {
	const response = await fetch(`${process.env.STRAPI_BASE_URL}/api${query}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		console.log("error getAPI");
		throw new Error("Failed to Get API End Point");
	}
	const { data } = await response.json();
	return data;
}

export async function getPAPI<T>(
	query: string,
): Promise<{ data: T; meta: Meta }> {
	const response = await fetch(`${process.env.STRAPI_BASE_URL}/api${query}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_ADMIN_API_TOKEN}`,
		},
	});
	if (!response.ok) {
		console.log("error getAPI");
		throw new Error("Failed to Get API End Point");
	}
	return await response.json();
}

const keyStr =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
	keyStr.charAt(e1 >> 2) +
	keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
	keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
	keyStr.charAt(e3 & 63);

export function rgbDataURL(r: number, g: number, b: number) {
	return `data:image/gif;base64,R0lGODlhAQABAPAA${
		triplet(0, r, g) + triplet(b, 255, 255)
	}/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
}

export async function createAPI<T>({
	data,
	route,
}: {
	data: CreateMembership | { webId: string };
	route: string;
}): Promise<T | null> {
	try {
		const response = await fetch(`${process.env.STRAPI_BASE_URL}/api${route}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.STRAPI_ADMIN_API_TOKEN}`,
			},
			body: JSON.stringify({ data }),
		});

		const json = await response.json();

		if (!response.ok) {
			if (json.error?.message?.includes("must be unique")) {
				console.warn("Resource already exists, returning null:", data);
				return null;
			}
			throw new Error(json.error?.message || "An unknown error occurred");
		}

		return "data" in json ? json.data : json;
	} catch (error: any) {
		console.error("Error occurred while creating resource:", error.message);
		throw error;
	}
}
