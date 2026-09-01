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
	"nav-link inline-flex items-center font-semibold text-accent hover:text-accent-hover";

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
				className={defaultStyle + " " + (style ?? "")}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
			>
				{children ?? label}
			</a>
		);
	}
	return (
		<Link href={href} className={defaultStyle + " " + (style ?? "")}>
			{label}
			{children}
		</Link>
	);
};
