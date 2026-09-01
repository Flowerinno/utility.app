import { NextRequest, NextResponse } from "next/server";
import { normalizeShop } from "@/utils/normalizeShop";

type TokenSuccess = {
	access_token: string;
	scope: string;
	expires_in: number;
};

type TokenErrorBody = {
	error?: string;
	error_description?: string;
	errors?: string;
};

/**
 * Proxy for Shopify client credentials grant.
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

	const { shop, client_id, client_secret } = body as Record<string, unknown>;

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
				grant_type: "client_credentials",
				client_id: client_id.trim(),
				client_secret: client_secret.trim(),
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

	let payload: TokenSuccess | TokenErrorBody | null = null;
	try {
		payload = (await shopifyResponse.json()) as TokenSuccess | TokenErrorBody;
	} catch {
		return NextResponse.json(
			{
				error: "invalid_response",
				message: "Shopify returned a non-JSON response.",
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

		const rawText = String(raw);
		const isShopNotPermitted =
			/shop_not_permitted/i.test(rawText) ||
			/client credentials cannot be performed/i.test(rawText);

		return NextResponse.json(
			{
				error: isShopNotPermitted ? "shop_not_permitted" : "token_request_failed",
				message: isShopNotPermitted
					? "shop_not_permitted: Client credentials only work when the app and store belong to the same Shopify organization, and the app is installed on that store."
					: rawText,
			},
			{ status: shopifyResponse.status >= 400 && shopifyResponse.status < 600
				? shopifyResponse.status
				: 502 }
		);
	}

	const success = payload as TokenSuccess;
	if (
		!success?.access_token ||
		typeof success.access_token !== "string" ||
		typeof success.expires_in !== "number"
	) {
		return NextResponse.json(
			{
				error: "invalid_response",
				message: "Shopify response was missing required token fields.",
			},
			{ status: 502 }
		);
	}

	return NextResponse.json({
		access_token: success.access_token,
		scope: success.scope ?? "",
		expires_in: success.expires_in,
	});
}
