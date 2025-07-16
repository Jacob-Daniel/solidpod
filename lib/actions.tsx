"use server";
import {
	CreateMembershipResponseAction,
	CreateMembership,
	CreateSignature,
	CreateResponseAction,
	CreatePetition,
	UploadPetition,
} from "@/lib/types";
import { createAPI } from "@/lib/functions";

export async function createMembershipAction(
	customerData: CreateMembership,
): Promise<CreateMembershipResponseAction> {
	const data = await createAPI<CreateMembershipResponseAction>({
		data: customerData,
		route: "memberships",
	});
	if (data && "error" in data) {
		return data;
	}
	return data;
}

export async function createSignatureAction(
	customerData: CreateSignature,
): Promise<CreateResponseAction> {
	const data = await createAPI<CreateResponseAction>({
		data: customerData,
		route: "signatures",
	});
	console.log(data, "action data");
	if (data && "error" in data) {
		return data;
	}
	return data;
}

export async function createPetitionAction(
	customerData: UploadPetition,
): Promise<CreateResponseAction> {
	const data = await createAPI<CreateResponseAction>({
		data: customerData,
		route: "petitions",
	});
	if ("error" in data) {
		if (data.error) {
			return data;
		}
	}
	return data;
}
