import type { Metadata } from "next";
import {
	Files,
	CreateMembership,
	CreateSignature,
	CreateMembershipResponseAction,
	Page,
} from "@/lib/types";

export async function getFiles(name: string): Promise<Files> {
	const url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/file-system/folder?path=${name}`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch Files");
	const data: Files = await res.json();
	return data;
}

export async function getAPI<T>(query: string): Promise<T> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API}${query}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	if (!response.ok) {
		console.log("error getAPI");
		throw new Error("Failed to Get API End Point");
	}
	const { data } = await response.json();
	return data;
}

export async function createAPI<T>({
	data,
	route,
}: {
	data: CreateMembership | CreateSignature;
	route: string;
}): Promise<T> {
	try {
		const response = await fetch(`${process.env.STRAPI_API}/${route}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
			},
			body: JSON.stringify({
				data: data,
			}),
		});
		if (!response.ok) {
			const errorBody = await response.json();
			throw new Error(errorBody.error?.message || "An unknown error occurred");
		}
		let json;
		try {
			json = await response.json();
		} catch (jsonError) {
			throw new Error(`Error parsing JSON response: ${jsonError}`);
		}
		// console.log(json, "create memb");
		return json;
	} catch (error: any) {
		console.error(
			"Error occurred while creating membership or signature:",
			error.message,
		);
		throw new Error(`Error parsing JSON response: ${error}`);
	}
}

export async function getAPIAuth<T>(query: string, jwt: string): Promise<T> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API}${query}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		},
	);
	if (!response.ok) {
		console.log("error getAPIAuth");
		throw new Error("Failed to Get API End Point");
	}
	const json = await response.json();

	if ("data" in json) {
		return json.data;
	} else {
		return json;
	}
}

// export async function generatePageMetadata(id: number): Promise<Metadata> {
// 	const data = getAPI<Page>();

// 	const page = data[0];

// 	const facebookImagepath = `${process.env.BASE_IMG_FB_URL}/${page.imagepath}`;
// 	const twitterImagepath = `${process.env.BASE_IMG_TW_URL}/${page.imagepath}`;

// 	return {
// 		title: page.title,
// 		description: page.summary,
// 		keywords: [page.metak],
// 		openGraph: {
// 			title: page.title,
// 			type: "article",
// 			url: process.env.BASE_URL,
// 			images: facebookImagepath,
// 		},
// 		twitter: {
// 			card: "summary_large_image",
// 			title: page.title,
// 			description: page.summary,
// 			images: twitterImagepath,
// 		},
// 	};
// }
