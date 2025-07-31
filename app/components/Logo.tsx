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
			<h1 className="inline-block w-[40px]">
				<Link
					title="home page link"
					className="relative"
					href={process.env.BASE_URL as string}
				>
					<Image src={img} width={40} height={40} alt="home page link" />
				</Link>
				<span className=" -indent-[9999px] absolute">
					{process.env.COMPANY_NAME as string}
				</span>
			</h1>
			{/*<span className="text-sm hidden md:inline">{tagline}</span>*/}
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
