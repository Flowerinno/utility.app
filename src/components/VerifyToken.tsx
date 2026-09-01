"use client";

import { FormEvent, useState } from "react";
import { notify } from "@/utils";

type VerifySuccess = {
	ok: true;
	shop_name: string;
	shop_domain: string;
	api_version: string;
	message: string;
};

type ApiError = {
	error?: string;
	message?: string;
};

export function VerifyToken() {
	const [shop, setShop] = useState("");
	const [accessToken, setAccessToken] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<VerifySuccess | null>(null);

	const copyField = async (label: string, value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			notify(`${label} copied`, "success");
		} catch {
			notify("Copy failed", "error");
		}
	};

	const onVerify = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setResult(null);

		if (!shop.trim() || !accessToken.trim()) {
			setError("Enter both the shop name and access token.");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/verify-token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					shop,
					access_token: accessToken,
				}),
			});

			const data = (await res.json()) as VerifySuccess & ApiError;

			if (!res.ok || !data.ok || typeof data.shop_name !== "string") {
				setError(
					data.message ||
						data.error ||
						"Could not verify this token against the shop."
				);
				notify("Verification failed", "error");
				return;
			}

			setResult({
				ok: true,
				shop_name: data.shop_name,
				shop_domain: data.shop_domain,
				api_version: data.api_version,
				message: data.message || "Token matches this shop.",
			});
			notify("Token matches this shop", "success");
		} catch {
			setError("Network error. Please try again.");
			notify("Network error", "error");
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setShop("");
		setAccessToken("");
		setError(null);
		setResult(null);
	};

	return (
		<main className="app-main animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">Verify Token</h1>
				<p className="page-subtitle">
					Check whether a Shopify Admin access token belongs to a given shop.
					Verification runs through a server proxy — the token is never logged
					or stored.
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<form onSubmit={onVerify} className="panel p-5 sm:p-6 space-y-4">
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
							htmlFor="access_token"
							className="mb-1.5 block text-sm font-medium text-ink"
						>
							Access token
						</label>
						<input
							id="access_token"
							name="access_token"
							type="password"
							required
							autoComplete="off"
							value={accessToken}
							onChange={(e) => setAccessToken(e.target.value)}
							className="field font-mono"
							placeholder="shpat_… — kept in this request only"
						/>
						<p className="mt-1.5 text-xs text-ink-muted">
							Sent only to this app’s server route, then to Shopify Admin
							GraphQL. Not persisted.
						</p>
					</div>

					<p className="text-xs leading-relaxed text-ink-muted">
						Calls{" "}
						<code className="font-mono text-ink">
							{"{ shop { name } }"}
						</code>{" "}
						on Admin API{" "}
						<code className="font-mono text-ink">2024-04</code>. Success
						requires shop data with no GraphQL errors.
					</p>

					<div className="flex flex-wrap gap-2 pt-1">
						<button
							type="submit"
							className="btn-primary min-w-[8rem]"
							disabled={loading}
						>
							{loading ? "Verifying…" : "Verify token"}
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
							<p className="font-semibold">Verification failed</p>
							<p className="mt-1.5 leading-relaxed">{error}</p>
						</div>
					)}

					{result ? (
						<div className="panel border-success bg-success-soft p-5 sm:p-6 space-y-4">
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-success">
								Token matches this shop
							</p>
							<p className="text-sm leading-relaxed text-ink">
								{result.message}
							</p>

							<div>
								<div className="mb-1.5 flex items-center justify-between gap-2">
									<span className="text-sm font-medium text-ink">
										Shop name
									</span>
									<button
										type="button"
										className="btn-ghost !px-2 !py-1 !text-xs"
										onClick={() => copyField("Shop name", result.shop_name)}
									>
										Copy
									</button>
								</div>
								<div className="code-panel break-all p-3 text-xs sm:text-sm bg-surface">
									{result.shop_name}
								</div>
							</div>

							<div>
								<div className="mb-1.5 flex items-center justify-between gap-2">
									<span className="text-sm font-medium text-ink">
										Shop domain
									</span>
									<button
										type="button"
										className="btn-ghost !px-2 !py-1 !text-xs"
										onClick={() =>
											copyField("Shop domain", result.shop_domain)
										}
									>
										Copy
									</button>
								</div>
								<div className="code-panel break-all p-3 text-xs sm:text-sm bg-surface">
									{result.shop_domain}
								</div>
							</div>

							<p className="text-xs text-ink-muted">
								Verified via Admin API{" "}
								<code className="font-mono text-ink">{result.api_version}</code>
								.
							</p>
						</div>
					) : (
						!error && (
							<div className="panel border-dashed bg-surface-muted p-5 sm:p-6 text-sm text-ink-muted space-y-2">
								<p>
									1. Enter the shop subdomain (or full{" "}
									<code className="font-mono text-ink">*.myshopify.com</code>{" "}
									host).
								</p>
								<p>
									2. Paste the Admin API access token (
									<code className="font-mono text-ink">shpat_…</code>).
								</p>
								<p>
									3. Verify — on success you’ll see the shop name from Shopify
									and a clear match confirmation.
								</p>
							</div>
						)
					)}
				</div>
			</div>
		</main>
	);
}

export default VerifyToken;
