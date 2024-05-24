import React from "react";
import Link from "next/link";

interface AnchorProps {
	href: string;
	children?: React.ReactNode;
	label: string;
	isAnchor?: boolean;
	style?: string;
}

const defaultStyle =
	"text-blue-500 hover:underline cursor-pointer transition-colors duration-300 ease-in-out font-bold text-md";

export const Anchor = ({
	href,
	children,
	label,
	style,
	isAnchor = false,
}: AnchorProps) => {
	if (isAnchor) {
		return (
			<a
				className={defaultStyle + " " + style}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
			>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} className={defaultStyle + " " + style}>
			<h3>{label}</h3>
			{children}
		</Link>
	);
};
