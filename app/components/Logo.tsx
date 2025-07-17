import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

import Link from "next/link";
import Image from "next/image";
import img from "@/public/images/logo.jpg";

export default function Logo() {
	return (
		<Container>
			<h1 className="block w-[50px]">
				<Link
					title="home page link"
					className="relative"
					href={process.env.BASE_URL as string}
				>
					<Image src={img} width={65} height={65} alt="home page link" />
				</Link>
				<span className=" -indent-[9999px] absolute">
					{process.env.COMPANY_NAME as string}
				</span>
			</h1>
		</Container>
	);
}

const Container = ({ children }: Props) => {
	return (
		<div className="relative col-span-12 md:col-span-2 lg:col-start-1 grid z-40 align-middle h-[100px] flex items-center">
			{children}
		</div>
	);
};
