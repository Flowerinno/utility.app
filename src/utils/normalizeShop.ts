/**
 * Normalize a shop input to the myshopify.com subdomain (no protocol / suffix).
 * Accepts: "store", "store.myshopify.com", "https://store.myshopify.com", etc.
 */
export function normalizeShop(input: string): string | null {
	const trimmed = input.trim().toLowerCase();
	if (!trimmed) return null;

	let value = trimmed
		.replace(/^https?:\/\//, "")
		.replace(/\/+$/, "")
		.split("/")[0]
		.split("?")[0];

	if (value.endsWith(".myshopify.com")) {
		value = value.slice(0, -".myshopify.com".length);
	}

	// Only allow valid myshopify subdomain characters
	if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) {
		return null;
	}

	return value;
}

/**
 * Build the Shopify authorize URL used in the user's proven flow.
 */
export function buildAuthorizeUrl(
	shop: string,
	clientId: string,
	redirectUri: string
): string | null {
	const shopDomain = normalizeShop(shop);
	if (!shopDomain || !clientId.trim() || !redirectUri.trim()) return null;

	const params = new URLSearchParams({
		grant_type: "client_credentials",
		client_id: clientId.trim(),
		redirect_uri: redirectUri.trim(),
	});

	return `https://${shopDomain}.myshopify.com/admin/oauth/authorize?${params.toString()}`;
}

/**
 * Extract an OAuth `code` from a raw code string or a full redirect URL.
 */
export function extractOAuthCode(input: string): string | null {
	const trimmed = input.trim();
	if (!trimmed) return null;

	// Full redirect URL with ?code=...
	if (/^https?:\/\//i.test(trimmed) || trimmed.includes("?")) {
		try {
			const url = new URL(
				trimmed.includes("://") ? trimmed : `http://placeholder${trimmed.startsWith("?") ? trimmed : `?${trimmed}`}`
			);
			const code = url.searchParams.get("code");
			if (code?.trim()) return code.trim();
		} catch {
			// fall through to regex
		}

		const match = trimmed.match(/[?&#]code=([^&#]+)/i);
		if (match?.[1]) {
			try {
				return decodeURIComponent(match[1]).trim() || null;
			} catch {
				return match[1].trim() || null;
			}
		}
		return null;
	}

	return trimmed;
}
