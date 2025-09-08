"use client";

import { useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import { redirect } from "next/navigation";

// Import your existing components
import Profile from "@/app/solid/Profile";
import Archive from "@/app/solid/Archive";
import NewArchive from "@/app/solid/CreateResourceForm";

export default function Dashboard() {
	const { isLoggedIn, session } = useSolidSession();
	const [activeTab, setActiveTab] = useState<
		"profile" | "archive" | "newArchive"
	>("profile");

	if (!isLoggedIn) {
		redirect("/");
	}

	return (
		<main className="grid grid-cols-12 gap-y-5 md:gap-y-10">
			<div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 gap-y-20 px-5 lg:px-0 md:gap-x-7 scroll-mt-24 md:pb-[250px]">
				<div className="md:border md:border-gray-200 dark:border-zinc-800 md:rounded md:p-5 flex-1 col-span-12 md:col-span-9 grid-cols-12">
					<h1 className="text-2xl font-semibold mb-3 lg:mb-0">Dashboard</h1>
					<div className="flex gap-3">
						{activeTab === "profile" && <Profile />}
						{activeTab === "archive" && <Archive />}
						{activeTab === "newArchive" && <NewArchive session={session} />}
					</div>
				</div>
				<aside className="hidden md:flex-1 md:flex md:flex-col md:col-span-3 gap-y-7 border p-3 rounded border-gray-200 dark:border-zinc-800 bg-gray-100 shadow relative  dark:bg-inherit dark:text-white">
					<button
						onClick={() => setActiveTab("profile")}
						className={`px-4 py-2 rounded ${
							activeTab === "profile"
								? "bg-blue-600 text-white"
								: "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"
						}`}
					>
						Profile
					</button>
					<button
						onClick={() => setActiveTab("archive")}
						className={`px-4 py-2 rounded ${
							activeTab === "archive"
								? "bg-blue-600 text-white"
								: "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"
						}`}
					>
						My Archive
					</button>
					<button
						onClick={() => setActiveTab("newArchive")}
						className={`px-4 py-2 rounded ${
							activeTab === "newArchive"
								? "bg-blue-600 text-white"
								: "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"
						}`}
					>
						New Archive
					</button>
				</aside>
			</div>
		</main>
	);
}
