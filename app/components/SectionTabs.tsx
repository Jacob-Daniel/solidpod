"use client";
import { useState, Suspense } from "react";
import { TabContent, TabsSection } from "@/lib/types";
import IconSwiper from "@/app/components/IconSwiper";
import Divider from "@/app/components/Divider";
interface IButton {
	isActive: boolean;
	heading: string;
	sub_heading: string;
	onShow(): void;
	bg_colour: string;
}

interface IPanel {
	isActive: boolean;
	classes: string;
	children: string | React.ReactNode;
}

type TabsProps = {
	list: TabsSection;
};

const Tabs: React.FC<TabsProps> = ({ list }) => {
	return (
		<Suspense fallback={<div className="col-span-12 mb-5">Loading...</div>}>
			<TabComponent list={list} />
		</Suspense>
	);
};

const TabComponent: React.FC<TabsProps> = ({ list }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	return (
		<section
			// style={{ backgroundColor: list.bg_colour }}
			className="relative z-50 col-span-12 mb-0 mx-0 bg-green-800/10 pt-10 pb-20"
		>
			<Divider height="h-30" bottom="bottom-55 md:bottom-38" />
			<div className="z-50 col-span-12 grid grid-cols-12 px-5 lg:px-10 flex flex-col gap-y-7 pb-50">
				{/*				<header className="col-span-12">
					<h2
						className={`uppercase font-100 text-2xl md:text-3xl tracking-wide leading-6 md:leading-8`}
					>
						{list.heading}
					</h2>
				</header>*/}
				<div className="col-span-12 content-center">
					<article className="space-between justify-center text-md flex text-center md:text-left gap-3 w-full mb-5">
						{list.tabs.map((tab, index) => (
							<Button
								key={tab.id}
								isActive={activeIndex === index}
								heading={tab.heading}
								sub_heading={tab.sub_heading || ""}
								onShow={() => setActiveIndex(index)}
								bg_colour={list.bg_colour}
							/>
						))}
					</article>
					<div className="col-span-12 grid grid-cols-12 xl:gap-x-5">
						{list.tabs.map(({ id, heading, tab_content }, index) => {
							return Array.isArray(tab_content) &&
								tab_content.every((item) => "icon" in item) ? (
								<Panel
									key={id}
									isActive={activeIndex === index}
									classes="col-span-12"
								>
									<IconSwiper
										json={tab_content} // Pass the array of IconTabContent
										id={`tab${id}`}
										pagination="swiper-pagination-use"
										route=""
										path=""
										icon_colour={list.icon_colour}
									/>
								</Panel>
							) : null;
						})}
					</div>
				</div>
			</div>
		</section>
	);
};

const Button: React.FC<IButton> = ({
	isActive,
	heading,
	sub_heading,
	onShow,
	bg_colour,
}) => {
	const classes = bg_colour;
	return (
		<button
			className={`group inline-block px-3 pt-[0.3rem] pb-[0.2rem] rounded cursor-pointer border-green-800/20 bg-green-800/20 border ${isActive && `bg-white`} hover:shadow-lg `}
			onClick={onShow}
		>
			<strong className={`block capitalize leading-4 text-base mb-1`}>
				{heading}
			</strong>
		</button>
	);
};

const Panel: React.FC<IPanel> = ({ isActive, classes, children }) => (
	<div
		className={`transition-opacity duration-300 ease-in-out ${classes} ${isActive ? "opacity-100 block" : "opacity-0 hidden"}`}
	>
		{children}
	</div>
);

export default Tabs;
