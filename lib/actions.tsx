"use server";
import {
	CreateMembershipResponseAction,
	CreateMembership,
	CreateSignature,
	CreateSignatureResponseAction,
} from "@/lib/types";
import { createAPI } from "@/lib/functions";

export async function createMembershipAction(
	customerData: CreateMembership,
): Promise<CreateMembershipResponseAction> {
	const data = await createAPI<CreateMembershipResponseAction>({
		data: customerData,
		route: "memberships",
	});
	if ("error" in data) {
		if (data.error) {
			return data;
		}
	}
	return data;
}

export async function createSignatureAction(
	customerData: CreateSignature,
): Promise<CreateSignatureResponseAction> {
	const data = await createAPI<CreateSignatureResponseAction>({
		data: customerData,
		route: "signatures",
	});
	if ("error" in data) {
		if (data.error) {
			return data;
		}
	}
	return data;
}
