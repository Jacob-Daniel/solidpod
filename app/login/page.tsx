import { auth } from "@/app/auth";
import LoginCreateAccountTabs from "@/app/components/LoginCreateAccountTabs";

export default async function Login() {
	const session = await auth();
	return (
		<div className="pb-20 px-5">
			<div className="lg:min-h-[600px] z-50 col-span-12 grid grid-cols-12 col-span-12 lg:px-0 lg:col-start-2 lg:col-span-10">
				<section className="z-50 min-h-[100%] col-span-12 md:col-start-5 md:col-span-4 justify-center py-10 pt-20 md:pt-32">
					{!session && <LoginCreateAccountTabs />}
					<Welcome session={session} />
				</section>
			</div>
		</div>
	);
}

const Welcome = ({ session }: { session: any }) => {
	if (session) {
		return (
			<h2 className="text-3xl z-50 text-white font-sans">Redirecting ...</h2>
		);
	} else {
		return <></>;
	}
};
