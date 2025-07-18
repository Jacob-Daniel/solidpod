"use client";
import { useState } from "react";
import { createCustomerAction } from "@/lib/userActions";
import { CreateAccount } from "@/lib/userTypes";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { validateInput } from "@/lib/clientFunctions";

type InputName = "mobile" | "password" | "email";

type FormValues = {
	username: string;
	mobile: string;
	password: string;
	email: string;
};

const CustomerForm = () => {
	const router = useRouter();
	const [formValues, setFormValues] = useState<FormValues>({
		username: "",
		mobile: "",
		password: "",
		email: "",
	});
	const [processing, setProcessing] = useState(false);
	const [errors, setErrors] = useState<{
		[key in keyof FormValues]: string | null;
	}>({
		username: null,
		mobile: null,
		password: null,
		email: null,
	});

	const [account, setAccount] = useState({
		errorMessage: "",
		successMessage: "",
	});

	const triggerCreateCustomer = async ({ data }: { data: CreateAccount }) => {
		try {
			const res = await createCustomerAction(data);
			if ((res as any).error) {
				const errorMsg = (res as any).error.details
					? `${(res as any).error.message} ${(res as any).error.details}`
					: (res as any).error.message ||
						`An error occurred ${(res as any).error.status}`;
				setAccount((prev) => ({ ...prev, errorMessage: errorMsg }));
			} else if ((res as any).jwt && (res as any).user) {
				const signInResult = await signIn("credentials", {
					redirect: false,
					jwt: (res as any).jwt,
					email: data.email,
					password: data.password,
				});

				if (signInResult?.ok) {
					router.push(`/my-petitions?createAccountSuccess=1`);
				} else {
					setAccount((prev) => ({
						...prev,
						errorMessage:
							"Login failed after registration. Please try to log in manually.",
					}));
				}
			} else {
				setAccount((prev) => ({
					...prev,
					errorMessage:
						"Unexpected response format. Please check server configuration.",
				}));
			}
		} catch (error) {
			console.log("Error creating customer:", error);
			setAccount((prev) => ({
				...prev,
				errorMessage: "An unexpected error occurred. Please try again later.",
			}));
		} finally {
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setProcessing(true); // Start processing immediately

		const newErrors: { [key in keyof FormValues]: string | null } = {
			username: null,
			mobile: null,
			password: null,
			email: null,
		};

		const formData = new FormData(event.currentTarget);
		const data: CreateAccount = {
			username: formData.get("username") as string,
			email: formData.get("email") as string,
			mobile: formData.get("mobile") as string,
			password: formData.get("password") as string,
		};

		// Validate fields and update error state
		for (const [field, value] of Object.entries(data)) {
			const fieldName = field as keyof FormValues;
			const errorMessage = validateInput(fieldName, value);

			if (errorMessage === null) {
				newErrors[fieldName] = ""; // Validation passed, clear error
			} else {
				newErrors[fieldName] = errorMessage; // Set the error message
			}
		}

		setErrors(newErrors); // Set errors state immediately

		// Check if there are errors (using `newErrors` instead of `errors`)
		const hasErrors = Object.values(newErrors).some((error) => error !== "");

		if (!hasErrors) {
			// No errors, trigger the customer creation process
			await triggerCreateCustomer({ data });
		} else {
			// Errors present, leave processing state as is
			console.log("Validation errors:", newErrors);
		}

		setProcessing(false); // Stop processing after validation or form submission
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-y-3 p-5 rounded w-full border border-gray-400"
		>
			<div className="text-left">
				<label htmlFor="username" className="font-bold">
					Name:
				</label>
				<input
					className="border border-gray-400 px-1 w-full"
					type="text"
					name="username"
					minLength={3}
					required
					autoComplete="off"
				/>
				{errors.username && (
					<span className="text-sm text-red-400">{errors.username}</span>
				)}
			</div>
			<div className="text-left">
				<label htmlFor="mobile" className="font-bold">
					Mobile:
				</label>
				<input
					className="border border-gray-400 px-1 w-full"
					type="text"
					name="mobile"
					required
				/>
				{errors.mobile && (
					<span className="text-sm text-red-400">{errors.mobile}</span>
				)}
			</div>
			<div className="text-left">
				<label htmlFor="paswsord" className="font-bold">
					Password:
				</label>
				<input
					className="border border-gray-400 px-1 w-full"
					type="password"
					name="password"
					autoComplete="off"
				/>
				{errors.password && (
					<span className="text-sm text-red-400">{errors.password}</span>
				)}
			</div>
			<div className="text-left">
				<label htmlFor="email" className="font-bold">
					Email:
				</label>
				<input
					className="border border-gray-400 px-1 w-full"
					type="email"
					name="email"
					required
				/>
				{errors.email && (
					<span className="text-sm text-red-400">{errors.email}</span>
				)}
			</div>
			<div className="text-left">
				<button
					type="submit"
					disabled={processing}
					className={`p-1 px-2 font-bold border border-gray-400 rounded ${processing ? "bg-gray-400" : ""}`}
				>
					{processing ? "processing ..." : "Submit"}
				</button>
			</div>
			<div>
				<p
					className={`p-2 ${account.errorMessage === "" ? "d-hidden" : "d-block border-red-200 border text-red-400"} ${account.successMessage === "" ? "d-hidden" : "d-block border-green-200 border text-green-400"}`}
				>
					{account.errorMessage || account.successMessage}
				</p>
			</div>
		</form>
	);
};

export default CustomerForm;
