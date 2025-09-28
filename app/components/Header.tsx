export const revalidate = 0;
import { ReactNode } from "react";

export default function Header({ children }: { children: ReactNode }) {
	return (
		<header
			id="top"
			className="grid grid-cols-12 w-full h-[70px] md:h-[80px] max-w-[1500px] align-middle mx-auto mb-5"
		>
			{children}
		</header>
	);
}
