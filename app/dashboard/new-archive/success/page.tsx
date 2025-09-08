"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SocialShareLinks from "@/app/components/SocialShareLinks";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import ShareButton from "@/app/components/ShareButton";

function GreetingName() {
	const searchParams = useSearchParams();

	const firstName = searchParams.get("first_name");
	const lastName = searchParams.get("last_name");
	return (
		<>
			{firstName && (
				<>
					{" "}
					{firstName} {lastName}!
				</>
			)}
		</>
	);
}
function Links() {
	const searchParams = useSearchParams();
	const shareText = searchParams.get("title") ?? "";
	const pageUrl = searchParams.get("page_url") ?? "";

	return (
		<SocialShareLinks
			url={pageUrl}
			title="Support this petition"
			text={shareText}
		/>
	);
}

function ShareText() {
	const searchParams = useSearchParams();
	const shareText = searchParams.get("title") ?? "";
	return <span className="text-red-700">{shareText}</span>;
}

function CopyLink() {
	const searchParams = useSearchParams();
	const pageUrl = searchParams.get("page_url") ?? "";
	return <CopyLinkButton url={pageUrl} />;
}

export default function SupportSuccessPage() {
	return (
		<main className="grid grid-cols-12 col-span-12 mb-20">
			<div className="md:col-start-2 md:col-span-10 grid grid-cols-12 md:gap-x-10">
				<div className="col-span-12 flex flex-col gap-y-10">
					<div className="border p-3 rounded text-center">
						<h2 className="font-sans font-bold text-lg md:text-2xl">
							Thank you
							<Suspense fallback="loading text ...">
								<GreetingName />
							</Suspense>
						</h2>
						<h2 className="font-bold font-sans text-lg md:text-xl">
							For creating petition:{" "}
							<Suspense fallback="loading text ...">
								<ShareText />
							</Suspense>
						</h2>
					</div>
					<div className="mb-8">
						<h2 className="font-sans font-bold text-lg md:text-xl mb-5">
							You can now share your petition.
						</h2>
						<div className="mb-6">
							<ShareButton />
							<p className="text-sm text-gray-500 mt-1">
								Opens system share dialog on mobile
							</p>
						</div>

						<Suspense fallback="loading links...">
							<Links />
						</Suspense>
						<div className="mt-6">
							<Suspense fallback="loading button ...">
								<CopyLink />
							</Suspense>
						</div>
					</div>{" "}
				</div>
			</div>
		</main>
	);
}
