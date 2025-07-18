import { auth } from "@/app/auth";
import LoginCreateAccountTabs from "@/app/components/LoginCreateAccountTabs";
import { redirect } from "next/navigation";

export default async function Login() {
	const session = await auth();
	return (
		<main className="px-5">
			<div className="lg:min-h-[500px] z-50 col-span-12 grid grid-cols-12 col-span-12 lg:px-0 lg:col-start-2 lg:col-span-10">
				<section className="z-50 min-h-[100%] col-span-12 md:col-start-4 md:col-span-6 justify-center py-10">
					{!session && <LoginCreateAccountTabs />}
					<Welcome session={session} />
				</section>
			</div>
		</main>
	);
}

const Welcome = ({ session }: { session: any }) => {
	if (session) {
		redirect("/my-petitions");
		return (
			<h2 className="text-3xl z-50 text-white font-sans">Redirecting ...</h2>
		);
	} else {
		return <></>;
	}
};
