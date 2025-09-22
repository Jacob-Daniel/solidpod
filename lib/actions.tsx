"use server";
import {
	CreateResponseAction,
	CreateMembershipResponseAction,
	CreateMembership,
} from "@/lib/types";
import { createAPI, createMembership } from "@/lib/functions";

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

export async function createMembershipAction(
	customerData: CreateMembership,
): Promise<CreateMembershipResponseAction> {
	const data = await createMembership({ data: customerData });
	if ("error" in data) {
		if (data.error) {
			return data;
		}
	}
	return data;
}
