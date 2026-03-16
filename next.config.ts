import type { NextConfig } from "next";
const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	distDir: "build",
	images: {
		dangerouslyAllowLocalIP: true,
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "1338",
				pathname: "/uploads/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "/**/images/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "/**/archive/uploads/**",
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
			{
				protocol: "https",
				hostname: "strapi.jacobdaniel.co.uk",
				pathname: "/uploads/**",
			},
		],
	},
};

export default nextConfig;
