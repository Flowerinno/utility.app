import { NextRequest, NextResponse } from "next/server";
import { extractOAuthCode, normalizeShop } from "@/utils/normalizeShop";

type TokenSuccess = {
	access_token: string;
	scope?: string;
	expires_in?: number;
};

type TokenErrorBody = {
	error?: string;
	error_description?: string;
	errors?: string;
};

/**
 * Proxy for Shopify OAuth code → access_token exchange.
 * Credentials and tokens are request-scoped only — never logged or persisted.
 */
export async function POST(request: NextRequest) {
	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "invalid_request", message: "Request body must be JSON." },
			{ status: 400 }
		);
	}

	if (!body || typeof body !== "object") {
		return NextResponse.json(
			{ error: "invalid_request", message: "Request body must be a JSON object." },
			{ status: 400 }
		);
	}

	const { shop, client_id, client_secret, code } = body as Record<
		string,
		unknown
	>;

	if (typeof shop !== "string" || !shop.trim()) {
		return NextResponse.json(
			{ error: "invalid_request", message: "Shop is required." },
			{ status: 400 }
		);
	}

	if (typeof client_id !== "string" || !client_id.trim()) {
		return NextResponse.json(
			{ error: "invalid_request", message: "Client ID is required." },
			{ status: 400 }
		);
	}

	if (typeof client_secret !== "string" || !client_secret.trim()) {
		return NextResponse.json(
			{ error: "invalid_request", message: "Client secret is required." },
			{ status: 400 }
		);
	}

	if (typeof code !== "string" || !code.trim()) {
		return NextResponse.json(
			{
				error: "invalid_request",
				message: "Authorization code is required (paste the code or full redirect URL).",
			},
			{ status: 400 }
		);
	}

	const shopDomain = normalizeShop(shop);
	if (!shopDomain) {
		return NextResponse.json(
			{
				error: "invalid_shop",
				message:
					"Invalid shop. Enter the store name (e.g. my-store) or my-store.myshopify.com.",
			},
			{ status: 400 }
		);
	}

	const authCode = extractOAuthCode(code);
	if (!authCode) {
		return NextResponse.json(
			{
				error: "invalid_code",
				message:
					"Could not parse an OAuth code. Paste the code value or the full redirect URL containing ?code=...",
			},
			{ status: 400 }
		);
	}

	const tokenUrl = `https://${shopDomain}.myshopify.com/admin/oauth/access_token`;

	let shopifyResponse: Response;
	try {
		shopifyResponse = await fetch(tokenUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: new URLSearchParams({
				client_id: client_id.trim(),
				client_secret: client_secret.trim(),
				code: authCode,
			}),
			cache: "no-store",
		});
	} catch {
		return NextResponse.json(
			{
				error: "network_error",
				message:
					"Could not reach Shopify. Check the shop name and your network connection.",
			},
			{ status: 502 }
		);
	}

	const rawBody = await shopifyResponse.text();
	let payload: TokenSuccess | TokenErrorBody | null = null;
	try {
		payload = rawBody ? (JSON.parse(rawBody) as TokenSuccess | TokenErrorBody) : null;
	} catch {
		const looksLikeMissingShop =
			shopifyResponse.status === 404 ||
			/^not\s*found$/i.test(rawBody.trim()) ||
			/<html/i.test(rawBody);

		return NextResponse.json(
			{
				error: looksLikeMissingShop ? "shop_not_found" : "invalid_response",
				message: looksLikeMissingShop
					? "Shop not found. Check the store name (subdomain of *.myshopify.com)."
					: "Shopify returned an unexpected response.",
			},
			{ status: 502 }
		);
	}

	if (!shopifyResponse.ok) {
		const raw =
			(payload && "error_description" in payload && payload.error_description) ||
			(payload && "error" in payload && payload.error) ||
			(payload && "errors" in payload && payload.errors) ||
			`Token request failed (${shopifyResponse.status}).`;

		return NextResponse.json(
			{
				error: "token_request_failed",
				message: String(raw),
			},
			{
				status:
					shopifyResponse.status >= 400 && shopifyResponse.status < 600
						? shopifyResponse.status
						: 502,
			}
		);
	}

	const success = payload as TokenSuccess;
	if (!success?.access_token || typeof success.access_token !== "string") {
		return NextResponse.json(
			{
				error: "invalid_response",
				message: "Shopify response was missing access_token.",
			},
			{ status: 502 }
		);
	}

	const response: {
		access_token: string;
		scope?: string;
		expires_in?: number;
	} = {
		access_token: success.access_token,
	};

	if (typeof success.scope === "string") {
		response.scope = success.scope;
	}

	if (typeof success.expires_in === "number") {
		response.expires_in = success.expires_in;
	}

	return NextResponse.json(response);
}
