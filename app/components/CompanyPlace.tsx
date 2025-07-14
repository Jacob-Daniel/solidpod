import { Address, Person } from "@/lib/types";
import CompanyAddress from "@/app/components/CompanyAddress";
import CompanyContact from "@/app/components/CompanyContact";

export default function place({
	className,
	address,
	person,
}: {
	className: string;
	address: Address;
	person: Person[];
}) {
	return (
		<div className="flex gap-y-3 flex-col">
			<CompanyAddress className={className} address={address} />
			{/*<CompanyContact className={className} contacts={person} />*/}
		</div>
	);
}
