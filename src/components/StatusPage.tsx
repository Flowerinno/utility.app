import { Suspense } from "react";
import { URLs } from "@/utils/constants";
import { ping } from "@/utils";

async function HealthStatusCard({ url }: { url: string }) {
	let time = Date.now();
	const status = await ping(url);
	time = Date.now() - time;

	const tone =
		status.status === "success"
			? {
					panel: "border-success bg-success-soft",
					badge: "bg-success text-white",
				}
			: status.status === "failed"
				? {
						panel: "border-warning bg-warning-soft",
						badge: "bg-warning text-white",
					}
				: {
						panel: "border-danger bg-danger-soft",
						badge: "bg-danger text-white",
					};

	const host = status.url.split("https://api.")[1] ?? status.url;

	return (
		<article className={`panel p-4 ${tone.panel}`}>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<p className="break-all font-mono text-sm text-ink">{host}</p>
					{status.statusCode && (
						<p className="mt-1.5 text-xs text-ink-muted">
							Status {status.statusCode} · {time} ms
						</p>
					)}
					{status.error && (
						<p className="mt-1.5 text-xs text-danger">Error: {status.error}</p>
					)}
				</div>
				<span
					className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide ${tone.badge}`}
				>
					{status.status.toUpperCase()}
				</span>
			</div>
		</article>
	);
}

export async function StatusPage() {
	return (
		<div className="animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">API Health Status</h1>
				<p className="page-subtitle">
					Live checks against configured service health endpoints.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{URLs.map((url) => (
					<Suspense
						key={url}
						fallback={
							<div className="panel animate-soft-pulse border-border bg-surface-muted p-4">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<p className="font-mono text-sm text-ink-muted">
											{url.split("https://api.")[1]}
										</p>
										<p className="mt-1 text-xs text-ink-muted">Checking…</p>
									</div>
								</div>
							</div>
						}
					>
						<HealthStatusCard url={url} />
					</Suspense>
				))}
			</div>
		</div>
	);
}

export default StatusPage;
