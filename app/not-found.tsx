import type { Metadata } from "next";

// export async function generateMetadata(): Promise<Metadata> {
// 	"use cache";

// 	return {
// 		title: "Not Found",
// 		description: "The page you're looking for doesn't exist",
// 	};
// }

export default function NotFound() {
	return (
		<section className="col-span-12 px-5 md:px-0 min-h-[500px] flex flex-col gap-y-5 items-center justify-center">
			<h2 className="text-2xl font-bold font-sans">Page Not Found</h2>
			<p>Please use the main menu to navigate to another page.</p>
		</section>
	);
}
