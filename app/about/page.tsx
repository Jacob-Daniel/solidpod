import RichContentRenderer from "@/app/components/RichPageContentRender";
import { getAPI } from "@/lib/functions";
import type { Page } from "@/lib/types";
export default async function About(): Promise<React.JSX.Element> {
	const [data] = await Promise.all([
		getAPI<Page[]>("/pages?filters[slug][$eq]=about&populate=*"),
	]);

	// const { title, sections } = pageResponse;

	// if (sections === null || typeof sections !== "object") {
	// 	return (
	// 		<section className="pt-10 md:pt-32 col-span-12 md:px-10 lg:px-0 lg:col-start-2 lg:col-span-10 pb-20 bg-white rounded">
	// 			No content available
	// 		</section>
	// 	);
	// }
	return (
		<main className="grid grid-cols-12 gap-y-10">
			{/*{data.banner && <BannerTop banner={data.banner} />}*/}

			{data[0] &&
				data[0].sections instanceof Array &&
				data[0].sections.map((section, index) => {
					switch (section.__component) {
						case "content.content":
							return (
								<div
									key={`p-${index}`}
									className="relative col-span-12 grid grid-cols-12 pb-20"
								>
									{" "}
									<div className="col-span-12 md:col-span-10 md:col-start-2">
										<RichContentRenderer
											blocks={section.content}
											className=""
										/>
									</div>
								</div>
							);

						default:
							console.warn("Unknown section type:", section.__component);
							return null;
					}
				})}
		</main>
	);
}
