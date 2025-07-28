"use client";
import { useState, Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation"; // Import this hook to access query params
import CreateCustomerAccountForm from "@/app/components/CreateAccountForm";
import PasswordResetForm from "@/app/components/PasswordResetForm";
import CustomLoginForm from "@/app/components/LoginForm";
import { IButton, IPanel } from "@/lib/types";

interface IItems {
	id: number;
	title: string;
}

export default function AuthTabs() {
	const { data: session } = useSession();
	const searchParams = useSearchParams(); // Use search params hook to get query params
	const accountParam = searchParams.get("account"); // Get the 'account' query param
	const tabs: IItems[] = [
		{ id: 0, title: "Login" },
		{ id: 1, title: "Create Account" },
	];

	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		if (accountParam === "create") {
			setActiveIndex(1); // If 'account=create' in query string, set to the "Create Account" tab
		} else {
			setActiveIndex(0); // Default to "Login" tab if no query string or 'account' is not 'create'
		}
	}, [accountParam]); // Update activeIndex whenever the query parameter changes

	if (session) {
		return <></>;
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<section className="mb-3 flex flex-wrap gap-2 md:gap-3 font-sans">
				{tabs.map((tab) => (
					<Button
						key={tab.id}
						isActive={activeIndex === tab.id}
						title={tab.title}
						onShow={() => setActiveIndex(tab.id)}
					/>
				))}
			</section>

			<div className="col-span-12 grid grid-cols-12 xl:gap-x-5">
				<Panel isActive={activeIndex === 0} classes="col-span-12 xl:p-0">
					<CustomLoginForm />
					<PasswordResetForm />
				</Panel>

				<Panel isActive={activeIndex === 1} classes="col-span-12 xl:p-0">
					<CreateCustomerAccountForm />
				</Panel>
			</div>
		</Suspense>
	);
}

const Button: React.FC<IButton> = ({ isActive, title, onShow }) => (
	<button
		className={`font-sans border inline-block px-2 py-[2px] font-bold cursor-pointer rounded md:px-2 ${isActive ? "border-yellow-400" : "border-gray-300"}`}
		onClick={onShow}
	>
		{title}
	</button>
);

const Panel: React.FC<IPanel> = ({ isActive, classes, children }) => {
	return (
		<div
			className={`font-sans lg:!opacity-100 transition-opacity duration-300 ease-in-out ${classes} ${isActive ? "opacity-100 block" : "opacity-0 hidden"}`}
		>
			{children}
		</div>
	);
};
