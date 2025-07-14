export default function H2({
	child,
	className,
}: {
	child: string;
	className: string;
}) {
	return <h2 className={className}>{child}</h2>;
}
