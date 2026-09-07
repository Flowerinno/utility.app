"use client";

import { useMemo, useState } from "react";
import {
	shopifySnippets,
	snippetCategoryNames,
} from "@/data/shopify-snippets";

export function ShopifySnippets() {
	const [query, setQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
	const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		let categories = shopifySnippets;

		if (activeCategory) {
			categories = categories.filter((cat) => cat.name === activeCategory);
		}

		if (!q) return categories;

		return categories
			.map((cat) => ({
				...cat,
				snippets: cat.snippets.filter((s) => {
					return (
						cat.name.toLowerCase().includes(q) ||
						s.title.toLowerCase().includes(q)
					);
				}),
			}))
			.filter((cat) => cat.snippets.length > 0);
	}, [query, activeCategory]);

	async function copyToClipboard(text: string, title: string) {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedTitle(title);
			setTimeout(() => setCopiedTitle(null), 1800);
		} catch (err) {
			console.error("Copy failed", err);
		}
	}

	return (
		<main className="app-main animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">Shopify Snippets</h1>
				<p className="page-subtitle">
					Search, expand, and copy Liquid debug snippets for common Shopify
					objects.
				</p>
			</div>

			<div className="mb-4 flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => setActiveCategory(null)}
					className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
						activeCategory === null
							? "bg-accent text-white"
							: "bg-surface-muted text-ink-muted hover:text-ink"
					}`}
				>
					All
				</button>
				{snippetCategoryNames.map((name) => (
					<button
						key={name}
						type="button"
						onClick={() => setActiveCategory(name)}
						className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
							activeCategory === name
								? "bg-accent text-white"
								: "bg-surface-muted text-ink-muted hover:text-ink"
						}`}
					>
						{name}
					</button>
				))}
			</div>

			<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
				<input
					aria-label="Search snippets"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="field flex-1"
					placeholder="Search by category or snippet title..."
				/>
				<button
					type="button"
					onClick={() => setQuery("")}
					className="btn-ghost self-start sm:self-auto"
					disabled={!query}
				>
					Clear
				</button>
			</div>

			{filtered.length === 0 ? (
				<p className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-8 text-center text-ink-muted">
					No snippets found.
				</p>
			) : (
				filtered.map((cat) => (
					<section key={cat.name} className="mb-8">
						<h2 className="mb-3 text-lg font-semibold text-ink">{cat.name}</h2>
						<div className="grid gap-3">
							{cat.snippets.map((s) => {
								const key = `${cat.name}||${s.title}`;
								const open = !!openMap[key];
								return (
									<div
										key={s.title}
										onClick={() =>
											setOpenMap((m) => ({ ...m, [key]: !m[key] }))
										}
										className="panel cursor-pointer p-4 transition-colors hover:border-accent"
									>
										<div
											className="flex items-center justify-between gap-3"
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													setOpenMap((m) => ({ ...m, [key]: !m[key] }));
												}
											}}
										>
											<div className="text-base font-medium text-ink">
												{s.title}
											</div>
											<div className="flex shrink-0 items-center gap-2">
												<button
													type="button"
													onClick={(ev) => {
														ev.stopPropagation();
														copyToClipboard(s.code, s.title);
													}}
													className="btn-secondary !px-3 !py-1.5 text-xs"
												>
													Copy
												</button>
												{copiedTitle === s.title && (
													<span className="text-xs font-medium text-success">
														Copied!
													</span>
												)}
												<svg
													className={`h-4 w-4 text-ink-muted transition-transform duration-200 ${
														open ? "rotate-180" : "rotate-0"
													}`}
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</div>
										</div>

										{open && (
											<pre className="code-panel mt-3 whitespace-pre-wrap p-3 text-sm">
												<code>{s.code.trim()}</code>
											</pre>
										)}
									</div>
								);
							})}
						</div>
					</section>
				))
			)}
		</main>
	);
}
