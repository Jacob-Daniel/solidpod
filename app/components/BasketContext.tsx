import React, {
	createContext,
	useContext,
	ReactNode,
	Dispatch,
	SetStateAction,
} from "react";
import { CreateBasketResponse } from "@/lib/userTypes";

interface BasketContextProps {
	basketData: CreateBasketResponse | null;
	setBasketData: (data: CreateBasketResponse | null) => void;
	clearBasket: () => void; // Ensure it returns boolean
	sessionId: string | null;
	logout: () => void; // Add logout function to context
	resetBasket: () => Promise<void>; // Ensure resetBasket is included and returns a Promise
}

interface BasketProviderProps {
	children?: ReactNode;
	sessionId: string | null;
	basketData: CreateBasketResponse | null;
	clearBasket: () => void; // Corrected to return boolean
	setBasketData: Dispatch<SetStateAction<CreateBasketResponse | null>>;
	logout: () => void;
	resetBasket: () => Promise<void>; // Ensure resetBasket is included and returns a Promise
}

const BasketContext = createContext<BasketContextProps | undefined>(undefined);

export const BasketProvider: React.FC<BasketProviderProps> = ({
	sessionId,
	basketData,
	clearBasket,
	setBasketData,
	logout,
	resetBasket,
	children,
}) => {
	return (
		<BasketContext.Provider
			value={{
				basketData,
				setBasketData,
				clearBasket,
				sessionId,
				logout,
				resetBasket,
			}}
		>
			{children}
		</BasketContext.Provider>
	);
};

export const useBasket = () => {
	const context = useContext(BasketContext);
	if (!context) {
		throw new Error("useBasket must be used within a BasketProvider");
	}
	return context;
};
