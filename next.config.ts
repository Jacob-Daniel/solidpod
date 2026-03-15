import type { NextConfig } from "next";
const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	distDir: "build",
	env: {
		STRAPI_BASE_URL: process.env.STRAPI_BASE_URL,
		STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API,
		BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		COMPANY_NAME: process.env.COMPANY_NAME,
	},
	images: {
		domains: ["localhost", "strapi.jacobdaniel.co.uk"], // or your Strapi domain
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "",
				pathname: "/uploads/**",
			},
			{
				protocol: "https",
				hostname: "img.youtube.com",
				port: "",
				pathname: "/vi/**",
			},
			{
				protocol: "https",
				hostname: "youtube.com",
				port: "",
				pathname: "/s/**",
			},
		],
	},
};

export default nextConfig;
