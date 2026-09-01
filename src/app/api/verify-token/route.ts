import { NextRequest, NextResponse } from "next/server";
import { normalizeShop } from "@/utils/normalizeShop";

const DEFAULT_API_VERSION = "2024-04";
const SHOP_QUERY = "{ shop { name } }";

type GraphQLShopResponse = {
	data?: {
		shop?: {
			name?: string | null;
		} | null;
	};
	errors?: Array<{ message?: string } | string>;
};

/**
 * Proxy that verifies a Shopify Admin access token against a shop via GraphQL.
 * The access token is request-scoped only — never logged or persisted.
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

	const { shop, access_token, api_version } = body as Record<string, unknown>;

	if (typeof shop !== "string" || !shop.trim()) {
		return NextResponse.json(
			{ error: "invalid_request", message: "Shop is required." },
			{ status: 400 }
		);
	}

	if (typeof access_token !== "string" || !access_token.trim()) {
		return NextResponse.json(
			{ error: "invalid_request", message: "Access token is required." },
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

	const version =
		typeof api_version === "string" && /^\d{4}-\d{2}$/.test(api_version.trim())
			? api_version.trim()
			: DEFAULT_API_VERSION;

	const graphqlUrl = `https://${shopDomain}.myshopify.com/admin/api/${version}/graphql.json`;

	let shopifyResponse: Response;
	try {
		shopifyResponse = await fetch(graphqlUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": access_token.trim(),
			},
			body: JSON.stringify({ query: SHOP_QUERY }),
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
	let payload: GraphQLShopResponse | null = null;
	try {
		payload = rawBody ? (JSON.parse(rawBody) as GraphQLShopResponse) : null;
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

	if (shopifyResponse.status === 401 || shopifyResponse.status === 403) {
		return NextResponse.json(
			{
				error: "invalid_token",
				message:
					"Invalid or unauthorized access token for this shop. The token may be wrong, expired, or belong to a different store.",
			},
			{ status: shopifyResponse.status }
		);
	}

	if (shopifyResponse.status === 404) {
		return NextResponse.json(
			{
				error: "shop_not_found",
				message:
					"Shop not found. Check the store name (subdomain of *.myshopify.com).",
			},
			{ status: 404 }
		);
	}

	if (!shopifyResponse.ok) {
		return NextResponse.json(
			{
				error: "http_error",
				message: `Shopify request failed (HTTP ${shopifyResponse.status}).`,
			},
			{
				status:
					shopifyResponse.status >= 400 && shopifyResponse.status < 600
						? shopifyResponse.status
						: 502,
			}
		);
	}

	const graphqlErrors = payload?.errors;
	if (Array.isArray(graphqlErrors) && graphqlErrors.length > 0) {
		const first = graphqlErrors[0];
		const message =
			typeof first === "string"
				? first
				: first?.message || "GraphQL request returned errors.";

		const lower = message.toLowerCase();
		const looksLikeAuth =
			lower.includes("access") ||
			lower.includes("unauthorized") ||
			lower.includes("denied") ||
			lower.includes("token") ||
			lower.includes("permission");

		return NextResponse.json(
			{
				error: looksLikeAuth ? "invalid_token" : "graphql_error",
				message: looksLikeAuth
					? "Token rejected by Shopify for this shop. It may be invalid, revoked, or missing required scopes."
					: message,
			},
			{ status: 401 }
		);
	}

	const shopName = payload?.data?.shop?.name;
	if (typeof shopName !== "string" || !shopName.trim()) {
		return NextResponse.json(
			{
				error: "verification_failed",
				message:
					"Shopify did not return shop data. The token may be invalid or not authorized for this shop.",
			},
			{ status: 401 }
		);
	}

	return NextResponse.json({
		ok: true,
		shop_name: shopName.trim(),
		shop_domain: `${shopDomain}.myshopify.com`,
		api_version: version,
		message: "Token matches this shop.",
	});
}
