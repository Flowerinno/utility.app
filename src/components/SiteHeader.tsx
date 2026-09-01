"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib";

const NAV_ITEMS = [
	{ label: "Env → JSON", href: ROUTES.envToJson },
	{ label: "Shopify Snippets", href: ROUTES.shopify_snippets },
	{ label: "Shopify Token", href: ROUTES.shopify_token },
	{ label: "Verify Token", href: ROUTES.verify_token },
] as const;

export function SiteHeader() {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-surface backdrop-blur-md">
			<div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3.5">
				<Link
					href="/"
					className="group inline-flex items-baseline gap-2 shrink-0"
				>
					<span className="text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
						Utilito
					</span>
					<span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
						App
					</span>
				</Link>

				<nav
					aria-label="Primary"
					className="flex flex-wrap items-center gap-1"
				>
					{NAV_ITEMS.map((item) => {
						const active =
							pathname === item.href ||
							pathname.startsWith(`${item.href}/`);
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`nav-link ${active ? "nav-link-active" : ""}`}
								aria-current={active ? "page" : undefined}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
