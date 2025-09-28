import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

export default {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			keyframes: {
				pulsehot: {
					"0%, 100%": { transform: "scale(1)", opacity: "1" },
					"50%": { transform: "scale(1.25)", opacity: "0.6" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"slide-in-lr": {
					"0%": { transform: "translateX(-100%)", opacity: "0" },
					"90%": { transform: "translateX(0)", opacity: "1" },
				},
				"slide-in-rl": {
					"0%": { transform: "translateX(100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				"slide-in-tb": {
					"0%": { transform: "translateY(-100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				"slide-in-bt": {
					"0%": { transform: "translateY(100%)", opacity: "0", delay: "0.5s" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},
			animation: {
				"fade-in": "fade-in 0.5s ease-out forwards",
				"slide-in-lr": "slide-in-lr 0.5s ease-out forwards",
				"slide-in-rl": "slide-in-rl 0.5s ease-out forwards",
				"slide-in-tb": "slide-in-tb 0.5s ease-out forwards",
				"slide-in-bt": "slide-in-bt 0.5s ease-out forwards",
				"pulse-hot": "pulsehot 1s infinite",
			},
			transitionDelay: {
				200: "0.2s",
				400: "0.4s",
				600: "0.6s",
				800: "0.8s",
			},
			screens: {
				tabletsm: "500px",
				tabletmd: "550px",
				retina: "600px",
				tablet: "700px",
				hd: "1366px", // Define the min-width for the xxl breakpoint
				qhd: "1440px", // Define the min-width for the xxl breakpoint
				"2xl": "1600px", // Define the min-width for the xxl breakpoint
			},
			fontSize: {
				xs: "0.625rem", // 10px
				sm: "0.75rem", // 12px
				base: "0.875rem", // 14px
				md: "1rem", // 16px
				lg: "1.125rem", // 18px
				xl: "1.25rem", // 20px
				"2xl": "1.5rem", // 24px
				"3xl": "1.875rem", // 30px
				"4xl": "2.25rem", // 36px
				"5xl": "3rem", // 48px
				"6xl": "3.75rem", // 60px

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
				body: "hsl(var(--body))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				border: "hsl(var(--border))",
				shadow: "hsl(var(--shadow))",
				hoverText: "hsl(var(--hover-text))",
				"background-solidpod": "hsl(var(--background-solidpod))",
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				primary: "hsl(var(--primary))",
				secondary: "hsl(var(--secondary))",
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
