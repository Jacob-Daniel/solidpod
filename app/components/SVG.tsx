import React from "react";
import { SVG } from "@/lib/types";

const CustomSVG = ({
	className,
	viewBox,
	path,
	gradientId,
	gradientColors,
	preserveAspectRatio,
	fill,
	stroke,
	strokeWidth,
	strokeOpacity,
}: SVG) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio={preserveAspectRatio}
			className={`${className}`}
			viewBox={viewBox}
		>
			<defs>
				<linearGradient id={gradientId} x1="0%" y1="25%" x2="0%" y2="100%">
					{gradientColors &&
						gradientColors.map((stop, index) => (
							<stop
								key={index}
								offset={stop.offset}
								style={{ stopColor: stop.color, stopOpacity: stop.opacity }}
							/>
						))}
				</linearGradient>
			</defs>
			<path
				id={gradientId}
				fill={fill ?? (gradientId ? `url(#${gradientId})` : "none")}
				d={path}
				stroke={stroke}
				strokeWidth={strokeWidth}
				strokeOpacity={strokeOpacity}
			/>
		</svg>
	);
};

export default CustomSVG;
