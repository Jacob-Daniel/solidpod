"use client";
import { useState } from "react";
import { createAccountAction } from "@/lib/userActions";
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
	postcode: string;
	last_name: string;
};

const AccountForm = () => {
	const router = useRouter();
	const [formValues, setFormValues] = useState<FormValues>({
		username: "",
		mobile: "",
		password: "",
		email: "",
		postcode: "",
		last_name: "",
	});
	const [processing, setProcessing] = useState(false);
	const [errors, setErrors] = useState<{
		[key in keyof FormValues]: string | null;
	}>({
		username: null,
		mobile: null,
		password: null,
		email: null,
		postcode: null,
		last_name: null,
	});

	const [account, setAccount] = useState({
		errorMessage: "",
		successMessage: "",
	});

	const triggerCreateCustomer = async ({ data }: { data: CreateAccount }) => {
		try {
			const res = await createAccountAction(data);
			console.log(res, "create");
			if ((res as any).error) {
				const errorMsg = (res as any).error.details
					? `${(res as any).error.message} ${(res as any).error.details}`
					: (res as any).error.message ||
						`An error occurred ${(res as any).error.status}`;
				setAccount((prev) => ({ ...prev, errorMessage: errorMsg }));
				console.log(account, "account error mes");
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
					console.log(account, "account error mes");
				}
			} else {
				setAccount((prev) => ({
					...prev,
					errorMessage:
						"Unexpected response format. Please check server configuration.",
				}));
				console.log(account, "account error mes");
			}
		} catch (error) {
			console.log("Error creating customer:", error);
			setAccount((prev) => ({
				...prev,
				errorMessage: "An unexpected error occurred. Please try again later.",
			}));
			console.log(error, "error mes");
		} finally {
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setProcessing(true);

		const newErrors: { [key in keyof FormValues]: string | null } = {
			username: null,
			mobile: null,
			password: null,
			email: null,
			postcode: null,
			last_name: null,
		};

		const formData = new FormData(event.currentTarget);
		const data: CreateAccount = {
			username: formData.get("username") as string,
			email: formData.get("email") as string,
			mobile: formData.get("mobile") as string,
			password: formData.get("password") as string,
			last_name: formData.get("last_name") as string,
			postcode: formData.get("postcode") as string,
		};

		for (const [field, value] of Object.entries(data)) {
			const fieldName = field as keyof FormValues;
			const errorMessage = validateInput(fieldName, value);

			if (errorMessage === null) {
				newErrors[fieldName] = "";
			} else {
				newErrors[fieldName] = errorMessage;
			}
		}

		setErrors(newErrors);
		const hasErrors = Object.values(newErrors).some((error) => error !== "");

		if (!hasErrors) {
			await triggerCreateCustomer({ data });
		} else {
			console.log("Validation errors:", newErrors);
		}

		setProcessing(false);
	};
	console.log(account, "account");
	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-y-3 p-5 rounded w-full border border-gray-300"
		>
			<div className="text-left">
				<label htmlFor="username" className="font-bold">
					Name:
				</label>
				<input
					className="border border-gray-300 px-1 w-full"
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
				<label htmlFor="last_name" className="font-bold">
					Last Name:
				</label>
				<input
					className="border border-gray-300 px-1 w-full"
					type="text"
					name="last_name"
					minLength={3}
					required
					autoComplete="off"
				/>
				{errors.last_name && (
					<span className="text-sm text-red-400">{errors.last_name}</span>
				)}
			</div>
			<div className="text-left">
				<label htmlFor="postcode" className="font-bold">
					Postcode:
				</label>
				<input
					className="border border-gray-300 px-1 w-full"
					type="text"
					name="postcode"
					minLength={6}
					required
					autoComplete="off"
				/>
				{errors.postcode && (
					<span className="text-sm text-red-400">{errors.postcode}</span>
				)}
			</div>
			<div className="text-left">
				<label htmlFor="mobile" className="font-bold">
					Mobile:
				</label>
				<input
					className="border border-gray-300 px-1 w-full"
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
					className="border border-gray-300 px-1 w-full"
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
					className="border border-gray-300 px-1 w-full"
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
					className={`p-1 px-2 font-bold border border-green-300 rounded cursor-pointer ${processing ? "bg-gray-400" : ""}`}
				>
					{processing ? "processing ..." : "Submit"}
				</button>
			</div>
			<div>
				<p
					className={`p-2 ${account.errorMessage === "" ? "d-hidden" : "d-block border-red-200 border text-red-400"} ${account.successMessage === "" ? "d-hidden" : "d-block border-green3200 border text-green-400"}`}
				>
					{account.errorMessage || account.successMessage}
				</p>
			</div>
		</form>
	);
};

export default AccountForm;
