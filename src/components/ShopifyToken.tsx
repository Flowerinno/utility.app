"use client";

import { FormEvent, useState } from "react";
import { notify } from "@/utils";

type TokenResult = {
	access_token: string;
	scope: string;
	expires_in: number;
};

type ApiError = {
	error?: string;
	message?: string;
};

function formatExpiresIn(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	if (hours > 0 && mins > 0) return `${seconds}s (~${hours}h ${mins}m)`;
	if (hours > 0) return `${seconds}s (~${hours}h)`;
	return `${seconds}s`;
}

export function ShopifyToken() {
	const [shop, setShop] = useState("");
	const [clientId, setClientId] = useState("");
	const [clientSecret, setClientSecret] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<TokenResult | null>(null);

	const copyField = async (label: string, value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			notify(`${label} copied`, "success");
		} catch {
			notify("Copy failed", "error");
		}
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setResult(null);
		setLoading(true);

		try {
			const res = await fetch("/api/shopify-token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					shop,
					client_id: clientId,
					client_secret: clientSecret,
				}),
			});

			const data = (await res.json()) as TokenResult & ApiError;

			if (!res.ok) {
				setError(data.message || data.error || "Request failed.");
				notify("Could not fetch token", "error");
				return;
			}

			setResult({
				access_token: data.access_token,
				scope: data.scope,
				expires_in: data.expires_in,
			});
			notify("Access token received", "success");
		} catch {
			setError("Network error. Please try again.");
			notify("Network error", "error");
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setShop("");
		setClientId("");
		setClientSecret("");
		setError(null);
		setResult(null);
	};

	return (
		<main className="app-main animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">Shopify Token</h1>
				<p className="page-subtitle">
					Exchange Dev Dashboard client credentials for an Admin API access
					token. Works for apps installed on stores in the same Shopify
					organization. Tokens last about 24 hours.
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<form onSubmit={onSubmit} className="panel p-5 sm:p-6 space-y-4">
					<div>
						<label
							htmlFor="shop"
							className="mb-1.5 block text-sm font-medium text-ink"
						>
							Shop
						</label>
						<input
							id="shop"
							name="shop"
							type="text"
							required
							autoComplete="off"
							spellCheck={false}
							value={shop}
							onChange={(e) => setShop(e.target.value)}
							className="field"
							placeholder="my-store or my-store.myshopify.com"
						/>
					</div>

					<div>
						<label
							htmlFor="client_id"
							className="mb-1.5 block text-sm font-medium text-ink"
						>
							Client ID
						</label>
						<input
							id="client_id"
							name="client_id"
							type="text"
							required
							autoComplete="off"
							spellCheck={false}
							value={clientId}
							onChange={(e) => setClientId(e.target.value)}
							className="field font-mono"
							placeholder="From Dev Dashboard → Settings"
						/>
					</div>

					<div>
						<label
							htmlFor="client_secret"
							className="mb-1.5 block text-sm font-medium text-ink"
						>
							Client secret
						</label>
						<input
							id="client_secret"
							name="client_secret"
							type="password"
							required
							autoComplete="off"
							value={clientSecret}
							onChange={(e) => setClientSecret(e.target.value)}
							className="field font-mono"
							placeholder="Kept in this request only — never stored"
						/>
					</div>

					<p className="text-xs leading-relaxed text-ink-muted">
						Uses Shopify&apos;s client credentials grant via a server proxy.
						Your secret and token are not logged or persisted.
					</p>

					<div className="flex flex-wrap gap-2 pt-1">
						<button
							type="submit"
							className="btn-primary min-w-[8rem]"
							disabled={loading}
						>
							{loading ? "Requesting…" : "Get access token"}
						</button>
						<button
							type="button"
							className="btn-secondary"
							onClick={reset}
							disabled={loading}
						>
							Reset
						</button>
					</div>
				</form>

				<div className="space-y-4">
					{error && (
						<div
							role="alert"
							className="panel border-danger bg-danger-soft p-4 text-sm text-danger"
						>
							<p className="font-semibold">Request failed</p>
							<p className="mt-1.5 leading-relaxed">{error}</p>
						</div>
					)}

					{result ? (
						<div className="panel p-5 sm:p-6 space-y-4">
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
								Token response
							</p>

							<div>
								<div className="mb-1.5 flex items-center justify-between gap-2">
									<span className="text-sm font-medium text-ink">
										access_token
									</span>
									<button
										type="button"
										className="btn-ghost !px-2 !py-1 !text-xs"
										onClick={() =>
											copyField("access_token", result.access_token)
										}
									>
										Copy
									</button>
								</div>
								<div className="code-panel break-all p-3 text-xs sm:text-sm">
									{result.access_token}
								</div>
							</div>

							<div>
								<div className="mb-1.5 flex items-center justify-between gap-2">
									<span className="text-sm font-medium text-ink">scope</span>
									<button
										type="button"
										className="btn-ghost !px-2 !py-1 !text-xs"
										onClick={() => copyField("scope", result.scope)}
										disabled={!result.scope}
									>
										Copy
									</button>
								</div>
								<div className="code-panel break-all p-3 text-xs sm:text-sm">
									{result.scope || "(none)"}
								</div>
							</div>

							<div>
								<div className="mb-1.5 flex items-center justify-between gap-2">
									<span className="text-sm font-medium text-ink">
										expires_in
									</span>
									<button
										type="button"
										className="btn-ghost !px-2 !py-1 !text-xs"
										onClick={() =>
											copyField("expires_in", String(result.expires_in))
										}
									>
										Copy
									</button>
								</div>
								<div className="code-panel p-3 text-xs sm:text-sm">
									{formatExpiresIn(result.expires_in)}
								</div>
							</div>
						</div>
					) : (
						!error && (
							<div className="panel border-dashed bg-surface-muted p-5 sm:p-6 text-sm text-ink-muted">
								Submit shop, client ID, and client secret to receive{" "}
								<code className="font-mono text-ink">access_token</code>,{" "}
								<code className="font-mono text-ink">scope</code>, and{" "}
								<code className="font-mono text-ink">expires_in</code>.
							</div>
						)
					)}
				</div>
			</div>
		</main>
	);
}

export default ShopifyToken;
