"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Updated import for query params

const PasswordResetForm = () => {
	const [processing, setProcessing] = useState(false);
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showResetForm, setShowResetForm] = useState(false);

	const searchParams = useSearchParams(); // Initialize searchParams to access query params

	useEffect(() => {
		const resetCode = searchParams.get("code"); // Extract the reset code from URL
		if (resetCode) {
			setCode(resetCode); // Set the code from URL query
		}
	}, [searchParams]);

	const handleSubmitRequest = async (event: React.FormEvent) => {
		event.preventDefault();
		setProcessing((prev) => !prev);

		if (!email) {
			setMessage("Please enter an email address.");
			return;
		}
		try {
			const res = await fetch("/api/request-reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await res.json();

			if (res.ok) {
				setMessage("Password reset email sent!");
			} else {
				setMessage(data.message || "An error occurred");
			}
		} catch (error) {
			setMessage("An error occurred while sending the request");
		}
		setProcessing((prev) => !prev);
	};
	const handleSubmitResetPassword = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!code || !newPassword || !confirmPassword) {
			setMessage("Please provide the reset code and both password fields.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setMessage("Passwords do not match!");
			return;
		}

		try {
			const res = await fetch("/api/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: code,
					password: newPassword,
					passwordConfirmation: confirmPassword,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				setMessage("Password successfully reset!");
				// Optionally redirect user to login page
				// router.push('/login');
			} else {
				setMessage(data.message || "An error occurred");
			}
		} catch (error) {
			setMessage("An error occurred while resetting the password");
		}
	};

	return (
		<div className="p-5 bg-white border border-gray-300 rounded mt-5 flex flex-col">
			<button
				className="self-start border border-gray-300 font-bold rounded py-1 px-2 text-left cursor-pointer"
				onClick={() => setShowResetForm((prev) => !prev)}
			>
				{showResetForm ? "Hide" : "Request Password"}
			</button>
			{showResetForm && (
				<div>
					<b>Reset Your Password</b>
					<form
						autoComplete="off"
						key="reques"
						id="requestReset"
						onSubmit={handleSubmitRequest}
						className="flex flex-col gap-y-3"
					>
						<input
							type="email"
							name="request-reset-password"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							className="border p-2"
							autoComplete="new-pasword"
						/>
						{!message.includes("reset email sent") && (
							<button
								type="submit"
								className={`${processing ? "bg-gray-400" : "bg-black"} rounded p-1 text-white`}
							>
								{processing ? "Processing ..." : "Request Password Reset"}
							</button>
						)}
					</form>
				</div>
			)}
			{message.includes("reset email sent") && (
				<div>
					<p className="bg-orange-600 text-white text-center p-2 mb-3 mt-3">
						<b>Password reset email sent!</b>
					</p>
					<b>Enter your reset code and new password</b>
					<form
						autoComplete="off"
						key="reset"
						id="resetForm"
						onSubmit={handleSubmitResetPassword}
						className="flex flex-col gap-y-3"
					>
						<input
							type="text"
							name="fake-field-a"
							autoComplete="off"
							style={{ display: "none" }}
						/>
						<input
							type="text"
							name="fake-field-b"
							autoComplete="off"
							style={{ display: "none" }}
						/>

						<input
							type="text"
							name="reset-code-b"
							placeholder="Enter your reset code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							required
							className="border p-2"
							autoComplete="off"
						/>
						<input
							name="new-pass-b"
							type="password"
							placeholder="Enter your new password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							className="border p-2"
							autoComplete="off"
						/>
						<input
							type="password"
							placeholder="Confirm your new password"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="border p-2"
							autoComplete="off"
						/>
						<button
							type="submit"
							disabled={processing}
							className={`${processing ? "bg-gray-400" : "bg-black"} rounded p-1 text-white`}
						>
							{processing ? "Processing ..." : "Reset Password"}
						</button>
					</form>
				</div>
			)}
			{message && (
				<p className="p-2 text-center">
					<b>{message}</b>
				</p>
			)}
		</div>
	);
};

export default PasswordResetForm;
