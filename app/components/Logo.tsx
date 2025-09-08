import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

import Link from "next/link";

export default function Logo({ tagline }: { tagline: string }) {
	return (
		<Container>
			<h1 className="inline-block border border-gray-400 px-1 font-bold">
				<Link
					title="home page link"
					className="relative"
					href={process.env.BASE_URL as string}
				>
					{tagline as string}
				</Link>
			</h1>
		</Container>
	);
}

const Container = ({ children }: Props) => {
	return (
		<div className="md:h-[70px] relative col-span-12 md:col-span-4 lg:col-start-1 gap-x-5 z-40 flex flex-row items-end md:items-center">
			{children}
		</div>
	);
};
