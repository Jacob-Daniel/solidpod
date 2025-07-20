import { v4 as uuidv4 } from "uuid";
export function generateNewSessionId(): string {
	return uuidv4(); // Generate a new UUID
}
import { createBasketAction } from "./userActions";
import {
	BookingDetails,
	BookingDetailsResponse,
	UpdateBasketData,

	CreateBasketResponse,
	CreateBookingResponse,
	CreateCustomerResponseAction,

	CreateAccount,
	IPaymentDetails,

	IApiResponse,
	IOrderResponse,
	PageResponse,
	CampsiteCapacity,
	DayStatus,
	ICarouselResponse,
	IActivities,
	IMediaItem,
	IMenu,
	AboutPageResponse,
	DynamicImage,
	Files,
} from "@/lib/userTypes";

export async function getAPI<T>(query: string): Promise<T> {
	if (typeof window !== "undefined") {
		throw new Error("getAPI() cannot be used on the client");
	}
	const url = `${process.env.STRAPI_BASE_URL}${query}`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!response.ok) {
		throw new Error(`Failed to Get API End Point for: ${url}`);
	}
	let data = await response.json();
	if (data.data) {
		data = data.data;
	}
	// console.log(data, 'getAPI');
	return data;
}

export async function createUser(userData: CreateAccount): Promise<
	| CreateCustomerResponseAction
	| {
			error: {
				status: string;
				name: string;
				details: { errors: [] };
				message: string;
			};
	  }
> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API}/auth/local/register`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		},
	);
	const data = await response.json();

	if (!response.ok) {
		return {
			error: {
				status: response.status,
				name: data.name,
				message: data.error.message || "An error occurred",
			},
		};
	}

	const id = data.user.id;

	const roleUpdateResponse = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API}/users/${id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
			},
			body: JSON.stringify({
				role: process.env.STRAPI_API_USER_ROLE_ID,
			}),
		},
	);

	roleUpdateResponse;
	return data;
}

export async function createBasket(
	basketData: UpdateBasketData,
): Promise<CreateBasketResponse> {
	if (basketData.data.sessionId) {
		const url = `/api/baskets?filter?[sessionId][$eq]=${basketData.data.sessionId}`;
		//check if exist already
		const basketExistsResponse = await getAPI<CreateBasketResponse>(url);
		if (!basketExistsResponse) {
			console.log(url, "creatbasket", basketExistsResponse);
			return basketExistsResponse;
		}
	}
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API}/baskets`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
			},
			body: JSON.stringify(basketData),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to create basket");
	}

	const data = await response.json();
	return data;
}

export async function getBasket(
	userDocumentId: string,
	sessionId: string,
): Promise<CreateBasketResponse> {
	const query = userDocumentId
		? `[user][documentId]=${userDocumentId}`
		: `[sessionId]=${sessionId}`;
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API}/baskets?filters${query}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
			},
		},
	);
	if (!response.ok) {
		throw new Error("Failed to get basket");
	}
	const data = await response.json();
	return data;
}

export async function updateBasket(
	docId: string,
	basketData: UpdateBasketData,
): Promise<CreateBasketResponse> {
	const filteredBasketData = { ...basketData };
	if ("documentId" in filteredBasketData.data) {
		delete filteredBasketData.data.documentId;
	}
	let responseText;

	if (docId) {
		try {
			const url = `${process.env.NEXT_PUBLIC_STRAPI_API}/baskets/${docId}`;
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
				},
				body: JSON.stringify(filteredBasketData),
			});

			const responseBody = await response.text();

			if (!response.ok) {
				console.error(
					`Failed update basket. Status: ${response.status} - ${url} ${response.statusText}. Response: ${responseBody}`,
				);
				const newBasket = await createBasket(basketData);
				return newBasket;
			}

			return JSON.parse(responseBody); // Parse response manually
		} catch (error) {
			console.error("Error updating basket:", error);
			throw new Error(`Error updating basket: ${error.message}`);
		}
	} else {
		const newBasket = await createBasket(basketData);
		return newBasket;
	}
}

export async function updateBasketStatus(
	documentId: string,
	status: string,
): Promise<CreateBasketResponse> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API}/baskets/${documentId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
			},
			body: JSON.stringify({
				data: {
					basketState: status,
				},
			}),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to update basket");
	}

	const data = await response.json();
	return data;
}

export async function getCampsiteInfo<T>(populateFields: string): Promise<T> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API}/${populateFields}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
			},
		},
	);
	if (!res.ok) throw new Error("Failed to fetch Campsite Info");
	const json: IApiResponse<T> = await res.json();
	return json.data;
}

export async function getCampsite<T>(populateFields: string): Promise<T> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API}/${populateFields}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
			},
		},
	);
	if (!res.ok) throw new Error("Failed to fetch Campsite");
	const json: IApiResponse<T> = await res.json();
	return json.data;
}

export async function getBooking({
	documentId,
}: {
	documentId: string;
}): Promise<BookingDetailsResponse> {
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API}/bookings/${documentId}?populate=*`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch Booking");
	return res.json();
}

interface IGAPI {
	data: {
		documentId: string;
		access_token: string;
		refresh_token: string;
		expiry_date: number;
	};
}

export async function updateGoogleAPIToken(
	token: string,
	refreshToken: string,
	expiresAt: number,
): Promise<any> {
	const newTokenData = {
		data: {
			access_token: token,
			refresh_token: refreshToken,
			expiry_date: expiresAt,
		},
	};

	const data = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API}/google-api`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
		body: JSON.stringify(newTokenData),
	});
	if (!data.ok) {
		throw new Error("Failed to update token");
	}
	return await data.json();
}

export async function getGoogleAPITokens(): Promise<any> {
	const data = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API}/google-api`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!data.ok) {
		throw new Error("Failed to update token");
	}
	return await data.json();
}

export async function getPage({
	page,
	query = "",
}: {
	page: string;
	query?: string;
}): Promise<PageResponse> {
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API}/${page}?populate=*${query}`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch Page");
	const data: PageResponse = await res.json();
	return data;
}

export async function getContactPage(): Promise<PageResponse> {
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API}/contact?populate[directions][populate][images][populate]=media&populate[address]=*&populate[contact]=*&populate[geolocation]=*&populate[social]=*`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch Contact Page");
	const data: PageResponse = await res.json();
	return data;
}

export async function getAboutPage(query: string): Promise<AboutPageResponse> {
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API}/${query}`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch About Page");
	const data: AboutPageResponse = await res.json();
	return data;
}

export async function getCarousel({
	documentId,
}: {
	documentId: string;
}): Promise<ICarouselResponse> {
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API}/carousels/${documentId}?populate=slides.media`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch carousel");
	const data: ICarouselResponse = await res.json();
	return data;
}

export async function getActivities(query: string): Promise<IActivities> {
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API}/${query}&populate=image`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch activities");
	const data: IActivities = await res.json();
	return data;
}

export async function getMenu(query: string): Promise<IMenu> {
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API}/${query}`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.STRAPI_USER_API_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch Menu");
	const data: IMenu = await res.json();
	return data;
}

export async function getGallery(name: string): Promise<Files> {
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

async function revalidateISR(path: string) {
	try {
		const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate?secret=${process.env.ISR_API_TOKEN}&path=${encodeURIComponent(
			`/${path}`,
		)}`;
		const response = await fetch(apiUrl);
		const data = await response.json();

		if (!response.ok) {
			console.error(`Failed to revalidate ${path}:`, data);
		} else {
			console.log(`Successfully revalidated ${path}`);
		}
	} catch (error) {
		console.error("Error in ISR revalidation:", error);
	}
}

export function createMediaItems(data: {
	images: DynamicImage[];
	videos?: { id: number; name?: string; video_embed_code?: string }[];
	comments?: { comment: string; name: string }[];
}): IMediaItem[] {
	const { images = [], videos = [], comments = [] } = data;

	const commentItems: IMediaItem[] = comments.map((comment, index) => ({
		id: index, // Replace with a unique ID if available
		type: "comments" as const,
		comment: comment.comment,
		name: comment.name,
	}));

	const mediaItems: IMediaItem[] = [
		...images.map((image) => ({
			id: image?.id,
			type: "images" as const, // Assert the literal type
			name: image.image.name || "",
			caption: image?.image?.caption || undefined,
			alt: image?.image?.alternativeText || undefined,
			smallURL: image?.image?.formats?.small?.url || "",
			largeURL: image?.image?.url || "",
		})),

		...videos.map((video) => ({
			id: video.id,
			type: "videos" as const, // Assert the literal type
			name: video.name || "",
			video_embed_code: video.video_embed_code || "",
		})),

		...commentItems,
	];

	// return mediaItems.sort(() => Math.random() - 0.5);
	return mediaItems.sort(() => Math.random() - 0.5);
}
