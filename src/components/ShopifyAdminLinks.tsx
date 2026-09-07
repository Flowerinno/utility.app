"use client";

import { useMemo, useState } from "react";
import { buildShopAdminLinks, notify } from "@/utils";

export function ShopifyAdminLinks() {
	const [shop, setShop] = useState("");
	const [themeId, setThemeId] = useState("");
	const [clientId, setClientId] = useState("");
	const [redirectUri, setRedirectUri] = useState("http://localhost");
	const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

	const links = useMemo(
		() =>
			buildShopAdminLinks(shop, {
				themeId,
				clientId,
				redirectUri,
			}),
		[shop, themeId, clientId, redirectUri]
	);

	async function copyUrl(url: string, label: string) {
		try {
			await navigator.clipboard.writeText(url);
			setCopiedLabel(label);
			setTimeout(() => setCopiedLabel(null), 1800);
			notify("Copied to clipboard", "success");
		} catch {
			notify("Copy failed", "error");
		}
	}

	return (
		<main className="app-main animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">Shop Admin Links</h1>
				<p className="page-subtitle">
					Generate copyable admin, theme editor, GraphiQL, and storefront URLs
					from a shop handle.
				</p>
			</div>

			<div className="panel mb-8 grid gap-4 p-5 sm:grid-cols-2">
				<label className="flex flex-col gap-2 sm:col-span-2">
					<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
						Shop handle
					</span>
					<input
						className="field"
						placeholder="my-store or my-store.myshopify.com"
						value={shop}
						onChange={(e) => setShop(e.target.value)}
					/>
				</label>

				<label className="flex flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
						Theme ID (optional)
					</span>
					<input
						className="field font-mono"
						placeholder="123456789"
						value={themeId}
						onChange={(e) => setThemeId(e.target.value)}
					/>
				</label>

				<label className="flex flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
						Client ID (optional, for OAuth link)
					</span>
					<input
						className="field font-mono"
						placeholder="App client ID"
						value={clientId}
						onChange={(e) => setClientId(e.target.value)}
					/>
				</label>

				<label className="flex flex-col gap-2 sm:col-span-2">
					<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
						Redirect URI (for OAuth link)
					</span>
					<input
						className="field font-mono"
						placeholder="http://localhost"
						value={redirectUri}
						onChange={(e) => setRedirectUri(e.target.value)}
					/>
				</label>
			</div>

			{!shop.trim() ? (
				<p className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-8 text-center text-ink-muted">
					Enter a shop handle to generate links.
				</p>
			) : !links ? (
				<p className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-8 text-center text-danger">
					Invalid shop handle. Use the store subdomain (e.g. my-store).
				</p>
			) : (
				<div className="grid gap-3 sm:grid-cols-2">
					{links.map((link) => (
						<div key={link.label} className="panel p-4">
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0 flex-1">
									<h2 className="font-semibold text-ink">{link.label}</h2>
									{link.description && (
										<p className="mt-0.5 text-xs text-ink-muted">
											{link.description}
										</p>
									)}
									<p className="mt-2 break-all font-mono text-xs text-ink-muted">
										{link.url}
									</p>
								</div>
								<div className="flex shrink-0 flex-col items-end gap-1">
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="btn-secondary !px-3 !py-1.5 text-xs"
									>
										Open
									</a>
									<button
										type="button"
										onClick={() => copyUrl(link.url, link.label)}
										className="btn-ghost !px-3 !py-1.5 text-xs"
									>
										Copy
									</button>
									{copiedLabel === link.label && (
										<span className="text-xs font-medium text-success">
											Copied!
										</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</main>
	);
}
