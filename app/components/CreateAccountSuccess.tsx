"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation"; // Import this hook to access query params

export default function CreateAccountSuccess() {
	const searchParams = useSearchParams(); // Use search params hook to get query params
	const accountParam = searchParams.get("createAccountSuccess"); // Get the 'account' query param
	return (
		<Suspense fallback={<div>Loading...</div>}>
			{accountParam && (
				<h2 className="text-lg md:text-2xl font-bold font-sans mb-5">
					New Account Created
				</h2>
			)}
		</Suspense>
	);
}
