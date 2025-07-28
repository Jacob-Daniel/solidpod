"use server";
import { auth } from "@/app/auth";

import {
	CreateAccount,
	UpdateBasketData,
	CreateAccountResponseAction,
	CreateBasketResponse,
	IOrderResponse,
} from "@/lib/userTypes";

import {
	createBasket,
	createUser,
	getBasket,
	updateBasket,
	updateBasketStatus,
	getAPI,
} from "@/lib/userFunctions";

export async function createAccountAction(customerData: CreateAccount): Promise<
	| CreateAccountResponseAction
	| {
			error: {
				status: string;
				name: string;
				details: { errors: [] };
				message: string;
			};
	  }
> {
	const data = await createUser(customerData);
	console.log("create res", data);
	if (data.error) {
		return data;
	}
	return data;
}

export async function createBasketAction(
	sessionId: string,
): Promise<CreateBasketResponse> {
	const basketData: UpdateBasketData = {
		data: {
			sessionId: sessionId,
			user: null,
			details: {
				numberOfNights: 0,
				numberOfAdults: 0,
				numberOfChildren: 0,
				numberOfVehicles: 0,
				arrivalDate: "",
				departureDate: "",
				price: "0",
				ipAddress: "",
			},
			basketState: "active",
		},
	};

	try {
		const createdBasket = await createBasket(basketData);

		if (!createdBasket.data) {
			throw new Error("Failed to create basket Action");
		}

		return createdBasket;
	} catch (error) {
		console.log("Error in createBasketAction:", error);
		throw error;
	}
}

export async function getBasketAction(
	userId: string,
	sessionId: string,
): Promise<CreateBasketResponse> {
	const basket = await getBasket(userId, sessionId);

	if (!basket.data) {
		throw new Error("Failed to get basket");
	}

	return basket;
}

export async function getOrderAction(orderId: string): Promise<IOrderResponse> {
	const data = await getAPI<IOrderResponse>(
		`/api/orders/${orderId}?populate=*`,
	);

	if (!data) {
		throw new Error("Failed to create basket");
	}

	return data;
}

export async function updateBasketAction(
	documentId: string,
	basketData: UpdateBasketData,
): Promise<CreateBasketResponse> {
	const basket = await updateBasket(documentId, basketData);
	if (!basket.data) {
		throw new Error("Failed to update basket");
	}

	return basket;
}

export async function updateBasketStatusAction(
	documentId: string,
	status: string,
): Promise<CreateBasketResponse> {
	const basket = await updateBasketStatus(documentId, status);

	if (!basket.data) {
		throw new Error("Failed to update basket status");
	}

	return basket;
}
