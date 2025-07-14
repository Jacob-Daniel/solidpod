"use server";
import { auth } from "@/app/auth";

import {
	CreateBookingResponse,
	CreateAccount,
	UpdateBasketData,
	CreateCustomerResponseAction,
	CreateBasketResponse,
	BookingDetails,
	IPaymentDetails,
	IOrderResponse,
} from "@/lib/userTypes";

import {
	createBasket,
	createBooking,
	createCustomer,
	createOrder,
	getBasket,
	updateBasket,
	updateBasketStatus,
	getAPI,
} from "@/lib/userFunctions";

export async function createBookingAction(
	bookingData: BookingDetails,
	basketDocumentId: string,
): Promise<CreateBookingResponse> {
	const session = await auth();
	if (!session || !session.user || !session.jwt) {
		throw new Error("User is not authenticated or token is missing");
	}
	const userDocumentId = session.user.documentId;
	const createdBooking = await createBooking(
		bookingData,
		session.jwt,
		userDocumentId,
		basketDocumentId,
	);

	if (!createdBooking.data) {
		throw new Error("Failed to create booking");
	}
	return createdBooking;
}

export async function createCustomerAction(
	customerData: CreateAccount,
): Promise<
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
	const data = await createCustomer(customerData);
	if (data.error) {
		return data;
	}
	return data;
}

export async function createOrderAction(
	basketDocumentId: string,
	paymentDetails: IPaymentDetails,
): Promise<IOrderResponse | null> {
	const session = await auth();
	if (!session || !session.user || !session.jwt) {
		throw new Error("User is not authenticated or token is missing");
	}
	const userDocumentId = session.user.documentId;
	try {
		const data = await createOrder(
			session.jwt,
			userDocumentId,
			basketDocumentId,
			paymentDetails,
		);
		session.orderId = data.documentId;
		return data;
	} catch (error) {
		console.error("Error creating order:", error);
		return null;
	}
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
