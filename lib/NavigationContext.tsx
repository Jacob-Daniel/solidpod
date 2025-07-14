"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context data
interface NavigationContextType {
	activeSubmenuId: number | null;
	setActiveSubmenuId: (id: number | null) => void;
	closeSubmenu: () => void;
}

// Create the context with an initial default value
const NavigationContext = createContext<NavigationContextType | undefined>(
	undefined,
);

// Create the provider component
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [activeSubmenuId, setActiveSubmenuId] = useState<number | null>(null);

	// Log whenever activeSubmenuId changes
	// console.log("Current activeSubmenuId in NavigationContext:", activeSubmenuId);

	const closeSubmenu = () => {
		// console.log("Closing submenu, setting activeSubmenuId to null");
		setActiveSubmenuId(null); // Reset the active submenu ID
	};

	const updateSubmenuId = (id: number | null) => {
		// console.log("Setting activeSubmenuId to:", id);
		setActiveSubmenuId(id);
	};

	return (
		<NavigationContext.Provider
			value={{
				activeSubmenuId,
				setActiveSubmenuId: updateSubmenuId,
				closeSubmenu,
			}}
		>
			{children}
		</NavigationContext.Provider>
	);
};

// Custom hook to use the NavigationContext
export const useNavigationContext = (): NavigationContextType => {
	const context = useContext(NavigationContext);
	if (!context) {
		throw new Error(
			"useNavigationContext must be used within a NavigationProvider",
		);
	}
	return context;
};
