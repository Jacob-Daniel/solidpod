import { formatDate } from "@/lib/utils";
import { ReactNode } from "react";
export default function ShowDate({
	date,
	type,
}: {
	date: string;
	type: boolean;
}) {
	return formatDate(new Date(date), type) as unknown as ReactNode;
}
