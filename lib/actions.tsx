"use server";
import { CreateResponseAction } from "@/lib/types";
import { createAPI } from "@/lib/functions";

export async function createArchiveAction(webId: {
	webId: string;
}): Promise<CreateResponseAction | null> {
	const data = await createAPI<CreateResponseAction>({
		data: webId,
		route: "archives",
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
