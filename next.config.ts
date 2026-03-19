import type { NextConfig } from "next";

const securityHeaders = [
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
	// CSP is intentionally absent here — set per-request with a nonce
	// in middleware.ts so Next.js hydration scripts are not blocked.
];

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: false,
	},
	distDir: "build",
	headers: async () => [
		{
			source: "/(.*)",
			headers: securityHeaders,
		},
	],
	images: {
		dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
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
				port: "3019",
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
				hostname: "nksja-css.northkensingtonlibrary.org",
				pathname: "/**/archive/uploads/**",
			},
			{
				protocol: "https",
				hostname: "nksja-admin.northkensingtonlibrary.org",
				pathname: "/uploads/**",
			},
		],
	},
};

export default nextConfig;
