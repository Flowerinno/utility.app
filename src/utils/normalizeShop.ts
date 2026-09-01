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
