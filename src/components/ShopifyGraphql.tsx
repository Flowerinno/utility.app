"use client";

import { FormEvent, useState } from "react";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { GRAPHQL_PRESETS } from "@/data/graphql-presets";
import { notify } from "@/utils";

type GraphqlResponse = {
	data?: unknown;
	errors?: Array<{ message: string; locations?: unknown[] }>;
};

export function ShopifyGraphql() {
	const [shop, setShop] = useState("");
	const [accessToken, setAccessToken] = useState("");
	const [query, setQuery] = useState(GRAPHQL_PRESETS[0].query);
	const [variables, setVariables] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<string | null>(null);

	function loadPreset(presetId: string) {
		const preset = GRAPHQL_PRESETS.find((p) => p.id === presetId);
		if (!preset) return;
		setQuery(preset.query);
		setVariables(preset.variables ?? "");
	}

	async function runQuery(e?: FormEvent) {
		e?.preventDefault();
		setError(null);
		setResult(null);
		setLoading(true);

		try {
			const response = await fetch("/api/shopify-graphql", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					shop,
					access_token: accessToken,
					query,
					variables: variables.trim() || undefined,
				}),
			});

			const payload = (await response.json()) as GraphqlResponse & {
				message?: string;
				error?: string;
			};

			if (!response.ok) {
				setError(payload.message || payload.error || "Request failed.");
				return;
			}

			setResult(JSON.stringify(payload, null, 2));
		} catch {
			setError("Network error. Check your connection and try again.");
		} finally {
			setLoading(false);
		}
	}

	const copyResult = () => {
		if (!result) return;
		navigator.clipboard.writeText(result);
		notify("Copied response to clipboard", "success");
	};

	return (
		<main className="app-main animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">GraphQL Playground</h1>
				<p className="page-subtitle">
					Run Admin API GraphQL queries against a shop. Paste an access token
					from the Shopify Token tool.
				</p>
			</div>

			<PrivacyNotice />

			<form onSubmit={runQuery} className="space-y-6">
				<div className="panel grid gap-4 p-5 sm:grid-cols-2">
					<label className="flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Shop
						</span>
						<input
							className="field"
							placeholder="my-store"
							value={shop}
							onChange={(e) => setShop(e.target.value)}
							required
						/>
					</label>

					<label className="flex flex-col gap-2 sm:col-span-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Access token
						</span>
						<input
							type="password"
							className="field font-mono"
							placeholder="shpat_..."
							value={accessToken}
							onChange={(e) => setAccessToken(e.target.value)}
							autoComplete="off"
							required
						/>
					</label>
				</div>

				<div>
					<div className="mb-3 flex flex-wrap items-center gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Presets
						</span>
						{GRAPHQL_PRESETS.map((preset) => (
							<button
								key={preset.id}
								type="button"
								onClick={() => loadPreset(preset.id)}
								className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-muted transition-colors hover:text-ink"
							>
								{preset.label}
							</button>
						))}
					</div>

					<label className="mb-4 flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Query
						</span>
						<textarea
							className="code-panel min-h-[220px] resize-y p-3"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							required
						/>
					</label>

					<label className="mb-4 flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Variables (JSON, optional)
						</span>
						<textarea
							className="code-panel min-h-[100px] resize-y p-3"
							placeholder='{ "handle": "my-product" }'
							value={variables}
							onChange={(e) => setVariables(e.target.value)}
						/>
					</label>

					<button
						type="submit"
						className="btn-primary"
						disabled={loading || !shop || !accessToken || !query}
					>
						{loading ? "Running…" : "Run query"}
					</button>
				</div>
			</form>

			{error && (
				<div className="mt-6 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
					{error}
				</div>
			)}

			{result && (
				<div className="mt-6">
					<div className="mb-2 flex items-center justify-between gap-3">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Response
						</span>
						<button
							type="button"
							className="btn-secondary !px-3 !py-1.5 text-xs"
							onClick={copyResult}
						>
							Copy
						</button>
					</div>
					<pre className="code-panel max-h-[480px] overflow-auto whitespace-pre-wrap p-4 text-sm">
						<code>{result}</code>
					</pre>
				</div>
			)}
		</main>
	);
}
