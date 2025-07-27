import type { Metadata } from "next";
import {
	Files,
	CreateMembership,
	CreateSignature,
	CreateMembershipResponseAction,
	CreatePetition,
	UploadPetition,
	StrapiResponse,
	Page,
	Meta,
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

export async function getPagAPI<T>(
	query: string,
): Promise<{ data: T; meta: Meta }> {
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
	return await response.json();
}

export async function createAPI<T>({
	data,
	route,
}: {
	data: CreateMembership | CreateSignature | CreatePetition | UploadPetition;
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
		console.log(response, "res server");
		if (!response.ok) {
			const errorBody = await response.json();
			throw new Error(errorBody.error?.message || "An unknown error occurred");
		}
		let json: StrapiResponse<T>;
		try {
			json = await response.json();
			console.log(json, "json res server");
		} catch (jsonError) {
			throw new Error(`Error parsing JSON response: ${jsonError}`);
		}
		if ("data" in json) {
			return json.data;
		} else {
			return json;
		}
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

// lib/uploadToStrapi.ts
export async function uploadImage<T>(
	imageFile: File,
	jwt: string,
): Promise<T | null> {
	try {
		const formData = new FormData();
		formData.append("files", imageFile);
		const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API}/upload`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
			body: formData,
		});

		if (!res.ok) {
			console.error("Image upload failed", res.statusText);
			return null;
		}

		const data = await res.json();
		// Returns the URL or ID of the uploaded image
		const uploaded = data[0];
		return uploaded || null;
	} catch (error) {
		console.error("Error uploading image:", error);
		return null;
	}
}
