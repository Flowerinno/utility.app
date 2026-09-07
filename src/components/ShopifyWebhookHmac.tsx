"use client";

import { useEffect, useState } from "react";
import { computeShopifyHmac, hmacMatches, notify } from "@/utils";

export function ShopifyWebhookHmac() {
	const [rawBody, setRawBody] = useState("");
	const [secret, setSecret] = useState("");
	const [headerValue, setHeaderValue] = useState("");
	const [computed, setComputed] = useState<string | null>(null);
	const [matches, setMatches] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!rawBody || !secret) {
			setComputed(null);
			setMatches(null);
			return;
		}

		let cancelled = false;
		setLoading(true);

		computeShopifyHmac(rawBody, secret)
			.then((hmac) => {
				if (cancelled) return;
				setComputed(hmac);
				setMatches(headerValue.trim() ? hmacMatches(hmac, headerValue) : null);
			})
			.catch(() => {
				if (cancelled) return;
				setComputed(null);
				setMatches(null);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [rawBody, secret, headerValue]);

	const copyComputed = () => {
		if (!computed) return;
		navigator.clipboard.writeText(computed);
		notify("Copied HMAC to clipboard", "success");
	};

	const reset = () => {
		setRawBody("");
		setSecret("");
		setHeaderValue("");
		setComputed(null);
		setMatches(null);
	};

	return (
		<main className="app-main animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">Webhook HMAC Verifier</h1>
				<p className="page-subtitle">
					Verify Shopify webhook signatures by computing HMAC-SHA256 (base64) of
					the raw request body.
				</p>
			</div>

			<div className="mb-6 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-ink">
				<strong className="font-semibold">Tip:</strong> Use the exact raw body
				bytes Shopify sent — not re-stringified JSON. Whitespace and key order
				matter.
			</div>

			<div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
				<div className="flex min-h-[420px] flex-1 flex-col gap-4">
					<label className="flex flex-1 flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Raw request body
						</span>
						<textarea
							className="code-panel min-h-[200px] flex-1 resize-y p-3"
							placeholder='{"id":123,"admin_graphql_api_id":"gid://..."}'
							value={rawBody}
							onChange={(e) => setRawBody(e.target.value)}
						/>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Webhook signing secret
						</span>
						<input
							type="password"
							className="field font-mono"
							placeholder="shpss_..."
							value={secret}
							onChange={(e) => setSecret(e.target.value)}
							autoComplete="off"
						/>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							X-Shopify-Hmac-Sha256 header (optional)
						</span>
						<input
							className="field font-mono"
							placeholder="Paste header value to compare"
							value={headerValue}
							onChange={(e) => setHeaderValue(e.target.value)}
						/>
					</label>
				</div>

				<div className="flex min-h-[420px] flex-1 flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
						Computed HMAC
					</span>
					<div className="code-panel flex flex-1 flex-col p-3">
						{loading && rawBody && secret ? (
							<p className="text-ink-muted">Computing…</p>
						) : computed ? (
							<>
								<pre className="flex-1 whitespace-pre-wrap break-all">
									<code>{computed}</code>
								</pre>
								{matches !== null && (
									<p
										className={`mt-3 text-sm font-semibold ${
											matches ? "text-success" : "text-danger"
										}`}
									>
										{matches
											? "✓ Signature matches header"
											: "✗ Signature does not match header"}
									</p>
								)}
							</>
						) : (
							<p className="text-ink-muted">
								Enter a raw body and signing secret to compute the HMAC.
							</p>
						)}
					</div>

					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							className="btn-primary"
							onClick={copyComputed}
							disabled={!computed}
						>
							Copy HMAC
						</button>
						<button type="button" className="btn-ghost" onClick={reset}>
							Reset
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
