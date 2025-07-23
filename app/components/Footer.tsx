import { getAPI } from "@/lib/functions";
import * as React from "react";
import UL from "@/app/components/UL";

import {
	// ILeaflet,
	Footer as IFooter,
	FooterComponent,
	HeadingComponent,
} from "@/lib/types";

export default async function Footer(): Promise<JSX.Element> {
	const [footer] = await Promise.all([
		getAPI<IFooter>(
			"/footer?populate[column_one][on][content.heading][populate][populate]=*&populate[column_two][on][content.heading][populate][populate]=*&populate[column_three][on][content.heading][populate]=*&populate[column_one][on][layout.navigation][populate][navigation_menu][populate]=navigation_items&populate[column_four][on][layout.social-platforms][populate][organisation][populate]=social_media.social",
		),
	]);
	return (
		<footer
			className={`relative z-30 grid grid-cols-12 col-span-12 w-full m-0 mt-16`}
		>
			<div className="lg:col-start-2 col-span-12 lg:col-span-10 w-full pt-5 pb-16 px-5 lg:px-0 text-white max-w-[1850px] 2xl:mx-auto text-sm border-top border-t-gray-300 border-t-1">
				<div className="flex flex-wrap justify-start gap-y-10 z-50 !text-sm">
					{Object.entries(footer).map(([key, value]) => {
						if (Array.isArray(value) && value.length > 0) {
							const heading = value.find(
								(item: FooterComponent): item is HeadingComponent =>
									item.__component === "content.heading" ||
									item.__component === "layout.navigation",
							)?.heading;
							return (
								<div key={key} className="flex-1 min-w-[220px] max-w-[300px] ">
									{heading && (
										<h3 className="text-md uppercase tracking-widest mb-2">
											{heading}
										</h3>
									)}
									{value &&
										value instanceof Array &&
										value.map((block, index) => {
											switch (block.__component) {
												case "layout.navigation":
													return (
														<UL
															key={index}
															menu={block}
															type="footer"
															className="mb-3 text-sm text-slate-800"
															classNameLi="pb-0 !leading-none"
														/>
													);
												default:
													return null;
											}
										})}
								</div>
							);
						}
						return null;
					})}
				</div>

				<div className="mt-1text-sm flex gap-1 w-full col-span-12">
					<span>&copy; {new Date().getFullYear()}</span>
				</div>
			</div>
		</footer>
	);
}
