"use client";

import React, { useEffect, useState } from "react";
import { BasketProvider } from "@/app/components/BasketContext";
import { initializeBasket } from "@/lib/userClientFunctions";
import { CreateBasketResponse } from "@/lib/userTypes";

interface ClientBasketProviderProps {
	children: React.ReactNode;
}

export const ClientBasketProvider: React.FC<ClientBasketProviderProps> = ({
	children,
}) => {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [basketData, setBasketData] = useState<CreateBasketResponse | null>(
		null,
	);

	// Helper function to clear session and basket
	const clearBasketData = () => {
		setSessionId(null);
		setBasketData(null);
		localStorage.removeItem("sessionId");
		localStorage.removeItem("basket");
	};

	// Function to initialize basket and set state
	const resetBasket = async () => {
		try {
			const { sessionId, basket } = await initializeBasket();
			if (sessionId && basket) {
				setSessionId(sessionId);
				setBasketData(basket);
			}
		} catch (error) {
			console.log("Error resetting basket:", error);
		}
	};

	// Initialize basket on mount
	useEffect(() => {
		const initialize = async () => {
			const existingSessionId = localStorage.getItem("sessionId");
			const storedBasket = localStorage.getItem("basket");
			if (existingSessionId && storedBasket) {
				setSessionId(existingSessionId);
				setBasketData(JSON.parse(storedBasket) as CreateBasketResponse);
			} else {
				await resetBasket(); // Ensure basket is initialized if not found
			}
		};

		initialize();
	}, []);

	// Persist basketData and sessionId to localStorage when they change
	useEffect(() => {
		if (sessionId) {
			localStorage.setItem("sessionId", sessionId);
		} else {
			localStorage.removeItem("sessionId");
		}

		if (basketData) {
			localStorage.setItem("basket", JSON.stringify(basketData));
		} else {
			localStorage.removeItem("basket");
		}
	}, [sessionId, basketData]);

	// Function to handle logout and clear session and basket data
	// const clear = () => {
	// 	clearBasketData(); // Use helper function
	// };

	const clearBasket = async () => {
		clearBasketData(); // Use helper function
		return resetBasket(); // Return the Promise from resetBasket
	};
	return (
		<BasketProvider
			sessionId={sessionId}
			basketData={basketData}
			clearBasket={clearBasket}
			setBasketData={setBasketData}
			logout={clearBasket}
			resetBasket={resetBasket}
		>
			{children}
		</BasketProvider>
	);
};
