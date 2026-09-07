/**
 * Compute Shopify webhook HMAC-SHA256 (base64) for a raw request body.
 * Matches X-Shopify-Hmac-Sha256 header verification.
 */
export async function computeShopifyHmac(
	rawBody: string,
	secret: string
): Promise<string> {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);
	const signature = await crypto.subtle.sign(
		"HMAC",
		key,
		encoder.encode(rawBody)
	);
	const bytes = new Uint8Array(signature);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

/**
 * Compare computed HMAC with a header value (trimmed, case-sensitive base64).
 */
export function hmacMatches(computed: string, headerValue: string): boolean {
	const expected = headerValue.trim();
	if (!expected) return false;
	return computed === expected;
}
