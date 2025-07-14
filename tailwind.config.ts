import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

export default {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			screens: {
				retina: "425px",
				tabletsm: "500px",
				tabletmd: "550px",
				tablet: "700px",
				hd: "1366px", // Define the min-width for the xxl breakpoint
				qhd: "1440px", // Define the min-width for the xxl breakpoint
				"2xl": "1600px", // Define the min-width for the xxl breakpoint
			},
			fontSize: {
				xs: "0.75rem", // 12px
				sm: "0.875rem", // 14px
				base: "1rem", // 16px
				md: "1.125rem", // 18px
				lg: "1.25rem", // 20px
				xl: "1.5rem", // 24px
				"2xl": "1.875rem", // 30px
				"3xl": "2.25rem", // 36px
				"4xl": "3rem", // 48px
				"5xl": "3.75rem", // 60px
				"6xl": "4.5rem", // 72px

				// Optional: Banner-specific custom names
				bannerxs: "1.625rem", // ~26px
				bannerbase: "2rem", // 32px
				bannersmall: "2.75rem", // 44px
				bannerxl: "3.5rem", // 56px
				banner2xl: "5rem", // 80px
				banner3xl: "6rem", // 96px
				banner4xl: "7rem", // 112px
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				body: "#292526",
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},
			fontFamily: {
				body: ["var(--font-karla)"],
				heading: ["var(--font-karla)"],
				openSans: ["var(--font-karla)"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			textShadow: {
				sm: "0 1px 2px var(--tw-shadow-color)",
				DEFAULT: "0 1px 4px var(--tw-shadow-color)",
				lg: "0 8px 16px var(--tw-shadow-color)",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		plugin(function ({ matchUtilities, theme }: any) {
			matchUtilities(
				{
					"text-shadow": (value: string) => ({
						textShadow: value,
					}),
				},
				{ values: theme("textShadow") },
			);
		}),
	],
} satisfies Config;
