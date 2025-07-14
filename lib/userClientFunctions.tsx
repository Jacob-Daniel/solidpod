import { generateNewSessionId } from "@/lib/userFunctions";
import { createBasketAction } from "@/lib/userActions";
import {
	BookingDetails,
	UpdateBasketData,
	CreateBasketResponse,
} from "@/lib/userTypes";
export const initializeBasket = async (): Promise<{
	sessionId: string;
	basket: CreateBasketResponse | null;
}> => {
	try {
		const sessionId = generateNewSessionId();
		const basket = await createBasketAction(sessionId); // Confirm this is being called
		localStorage.setItem("sessionId", sessionId);
		localStorage.setItem("basket", JSON.stringify(basket));
		return { sessionId, basket };
	} catch (error) {
		console.log("Error initializing basket:", error);
		return { sessionId: "", basket: null };
	}
};

export const createBookingTitle = (name: string, date: Date) => {
	const day = date.getDate(); // Get day (1-31)
	const month = date.getMonth() + 1; // Get month (0-11, so add 1 to make it 1-12)
	const year = date.getFullYear(); // Get full year
	const bookingTitle = `${name.toLowerCase()}_${day}_${month}_${year}`;
	return bookingTitle;
};

export async function transformBookingToBasket(
	bookingData: BookingDetails,
	sessionId: string | null,
	userId: string | null,
	ipAddress: string,
	active: "active",
): Promise<UpdateBasketData> {
	return {
		data: {
			sessionId,
			user: userId,
			details: {
				numberOfNights: bookingData.number_of_nights,
				numberOfAdults: bookingData.number_of_adults,
				numberOfChildren: bookingData.number_of_children,
				numberOfVehicles: bookingData.number_of_vehicles,
				arrivalDate: bookingData.start_date,
				departureDate: bookingData.end_date,
				price: parseFloat(bookingData.booking_price).toFixed(2),
				ipAddress: ipAddress,
			},
			// documentId: bookingData.documentId || '',
			basketState: active,
		},
	};
}
