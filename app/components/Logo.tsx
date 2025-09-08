import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

import Link from "next/link";
import Image from "next/image";
import img from "@/public/images/logo.webp";

export default function Logo({ tagline }: { tagline: string }) {
	return (
		<Container>
			<h1 className="inline-block">
				<Link
					title="home page link"
					className="relative"
					href={process.env.BASE_URL as string}
				>
					{process.env.COMPANY_NAME as string}
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
