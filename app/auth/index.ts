import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getBasket } from "@/lib/userFunctions";
import { createBasketAction } from "@/lib/userActions";
import { CreateBasketResponse } from "@/lib/userTypes";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		jwt: string;
		basket: CreateBasketResponse | null;
		orderId: string | null;
		user: {
			documentId: string;
			jwt: string;
			username: string;
			name?: string | null;
			email?: string | null;
		};
	}

	interface User {
		documentId: string;
		jwt: string;
		username: string;
		name?: string | null;
		email?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		jwt: string;
		name?: string | null;
		email?: string | null;
	}
}

const authOptions: NextAuthConfig = {
	providers: [
		CredentialsProvider({
			name: "Meadow Farm Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				try {
					const res = await fetch(`${process.env.STRAPI_API_URL}/auth/local`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							identifier: credentials?.email,
							password: credentials?.password,
						}),
					});

					const data = await res.json();

					if (res.ok && data.user) {
						return { ...data.user, jwt: data.jwt }; // Return user + jwt token
					} else {
						console.error("Authentication failed:", data);
						return null; // Return null on failure
					}
				} catch (error) {
					console.error("Authorization error:", error);
					return null; // Return null if there's an error
				}
			},
		}),
	],
	session: {
		strategy: "jwt", // Use JWT for session management
		maxAge: 10 * 60, //10 minutes
	},
	jwt: {
		maxAge: 10 * 60, //10 minutes
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.documentId || ""; // Ensure user ID is a string
				token.jwt = user.jwt || ""; // Ensure JWT is a string
				token.name = user.username || ""; // Add username or email as fallback
				token.email = user.email || ""; // Add email to the token
				if (token && token.exp) {
					console.log(
						`New JWT issued. Expires at: ${new Date(token.exp * 1000)}`,
					);
				}
			}
			return token;
		},

		async session({ session, token }) {
			session.jwt = token.jwt ?? "";
			session.user = session.user ?? {};
			session.user.documentId = token.id ?? "";
			session.user.jwt = token.jwt ?? "";
			session.user.username = token.name ?? "";
			session.user.name = token.name ?? "";
			session.user.email = token.email ?? "";
			session.orderId = null;
			if (session.user.documentId) {
				try {
					const basketData = await getBasket(session.user.documentId, "");

					if (basketData && basketData.data) {
						const isPaidOrArchived =
							basketData.data.basketState === "paid" ||
							basketData.data.basketState === "archived";

						if (isPaidOrArchived) {
							console.log(
								"Clearing basket due to paid/archived state:",
								session.basket,
							);
							session.basket = null;
						} else {
							// console.log('Updating session basket:', basketData);
							session.basket = basketData;
						}
					} else {
						console.log("No basket data found. Creating basket with id");
						createBasketAction(session.user.documentId);
						session.basket = null;
					}
				} catch (error) {
					console.error("Error fetching basket:", error);
					session.basket = null;
				}
			} else {
				console.warn(
					"No user document ID found, session.basket will remain unchanged.",
				);
			}

			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	trustHost: true,
};

export { authOptions };

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
