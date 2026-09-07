export function PrivacyNotice() {
	return (
		<div
			role="note"
			className="mb-6 rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm text-ink-muted"
		>
			<strong className="font-semibold text-ink">Privacy:</strong> Credentials,
			tokens, and secrets are used only for the current request and are never
			stored or logged.
		</div>
	);
}
