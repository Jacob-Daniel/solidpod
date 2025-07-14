import { Address } from "@/lib/types";

export default function address({
	className,
	address,
}: {
	className: string;
	address: Address;
}) {
	return (
		<div>
			<p className={className}>
				{address.address_line_1}
				<br />
				{address.address_line_2}
				<br />
				{address.postcode}
				<br />
				{address.address_line_3}
				<br />
			</p>
		</div>
	);
}
