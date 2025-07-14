import { Person } from "@/lib/types";

export default function CompanyContact({
	className,
	contacts,
}: {
	className: string;
	contacts: Person[];
}) {
	const [{ name, tel, email }] = contacts;
	return (
		<div>
			{contacts && (
				<div>
					<p className={className}>
						<strong>{name}</strong>
						<br />
						<a href={`tel:${tel}`}>{tel}</a>
						<br />
						<a className="capitalize" href={`mailto:${email}`}>
							email
						</a>
					</p>
				</div>
			)}
		</div>
	);
}
