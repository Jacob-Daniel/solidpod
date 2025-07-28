import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const CustomLoginForm: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
			callbackUrl: "/my-petitions",
		});

		if (result?.error) {
			if (result.error === "CredentialsSignin") {
				console.log("Invalid credentials or other authentication issues.");
				setError("Please Provide Valid Credentials.");
			} else {
				console.error("Unknown error during login:", result.error);
			}
			setLoading(false);
		} else {
			setLoading(false);
			router.push("/my-petitions");
		}
	};
	return (
		<form
			id="loginForm"
			onSubmit={handleSubmit}
			className="flex flex-col gap-y-3 border border-gray-300 rounded p-5 items-start"
		>
			<div className="text-left w-full">
				<label htmlFor="email" className="font-bold">
					Email
				</label>
				<input
					className="border border-gray-300 px-1 w-full"
					type="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					autoComplete="off"
				/>
			</div>
			<div className="text-left w-full">
				<label htmlFor="password" className="font-bold">
					Password
				</label>
				<input
					className="border border-gray-300 px-1 w-full mb-2"
					type="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					autoComplete="off"
				/>
			</div>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<button
				type="submit"
				className={`border-gray-300 border !flex-shrink p-1 px-2 font-bold rounded cursor-pointer ${loading && "bg-gray-400"}`}
			>
				{(loading && "loading ...") || "Submit"}
			</button>
		</form>
	);
};

export default CustomLoginForm;
