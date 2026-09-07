"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavTools, getToolNavLabel } from "@/lib";

export function SiteHeader() {
	const pathname = usePathname();
	const navItems = getNavTools();

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
					{navItems.map((item) => {
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
								{getToolNavLabel(item)}
							</Link>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
