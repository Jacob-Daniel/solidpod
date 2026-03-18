"use server";
import { CreateResponseAction } from "@/lib/types";
import { createAPI, getAPI } from "@/lib/functions";

export async function createArchiveAction(webId: {
	webId: string;
}): Promise<CreateResponseAction | null> {
	const data = await createAPI<CreateResponseAction>({
		data: webId,
		route: "/archives",
	});
	if (data && "error" in data) {
		if (data.error) {
			return data;
		}
		return data;
	} else {
		return null;
	}
}

export async function getArchiveByWebId(webId: string) {
	const encoded = encodeURIComponent(webId);
	const result = await getAPI<{ webId: string; verified: boolean }[]>(
		`/archives?filters[webId][$eq]=${encoded}`,
	);
	return result?.[0] ?? null;
}

export async function checkVerifiedAction(webId: string): Promise<boolean> {
	try {
		const archive = await getArchiveByWebId(webId);
		return archive?.verified === true;
	} catch {
		return false;
	}
}
