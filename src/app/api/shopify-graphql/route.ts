import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { normalizeShop } from "@/utils/normalizeShop";

const MAX_QUERY_LENGTH = 50_000;
const MAX_VARIABLES_LENGTH = 10_000;
const SHOPIFY_API_VERSION = "2025-01";

type GraphqlBody = {
	shop?: string;
	access_token?: string;
	query?: string;
	variables?: string | Record<string, unknown> | null;
};

export async function POST(request: NextRequest) {
	const ip = getClientIp(request);
	const rate = checkRateLimit(`shopify-graphql:${ip}`, { limit: 30, windowMs: 60_000 });

	if (!rate.allowed) {
		return NextResponse.json(
			{
				error: "rate_limit_exceeded",
				message: `Too many requests. Try again in ${rate.retryAfterSec}s.`,
			},
			{
				status: 429,
				headers: rate.retryAfterSec
					? { "Retry-After": String(rate.retryAfterSec) }
					: undefined,
			}
		);
	}

	const contentLength = request.headers.get("content-length");
	if (contentLength && Number(contentLength) > 65_000) {
		return NextResponse.json(
			{ error: "invalid_request", message: "Request body too large." },
			{ status: 413 }
		);
	}

	let body: GraphqlBody;

	try {
		body = (await request.json()) as GraphqlBody;
	} catch {
		return NextResponse.json(
			{ error: "invalid_request", message: "Request body must be JSON." },
			{ status: 400 }
		);
	}

	const { shop, access_token, query, variables } = body;

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

	if (typeof query !== "string" || !query.trim()) {
		return NextResponse.json(
			{ error: "invalid_request", message: "GraphQL query is required." },
			{ status: 400 }
		);
	}

	if (query.length > MAX_QUERY_LENGTH) {
		return NextResponse.json(
			{
				error: "invalid_request",
				message: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters.`,
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

	let parsedVariables: Record<string, unknown> | undefined;

	if (variables !== undefined && variables !== null && variables !== "") {
		if (typeof variables === "string") {
			if (variables.length > MAX_VARIABLES_LENGTH) {
				return NextResponse.json(
					{
						error: "invalid_request",
						message: `Variables exceed maximum length of ${MAX_VARIABLES_LENGTH} characters.`,
					},
					{ status: 400 }
				);
			}
			try {
				parsedVariables = JSON.parse(variables) as Record<string, unknown>;
			} catch {
				return NextResponse.json(
					{
						error: "invalid_variables",
						message: "Variables must be valid JSON.",
					},
					{ status: 400 }
				);
			}
		} else if (typeof variables === "object") {
			parsedVariables = variables;
		}
	}

	const graphqlUrl = `https://${shopDomain}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

	let shopifyResponse: Response;
	try {
		shopifyResponse = await fetch(graphqlUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": access_token.trim(),
				Accept: "application/json",
			},
			body: JSON.stringify({
				query,
				variables: parsedVariables,
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
	let payload: unknown = null;

	try {
		payload = rawBody ? JSON.parse(rawBody) : null;
	} catch {
		return NextResponse.json(
			{
				error: "invalid_response",
				message: "Shopify returned an unexpected response.",
			},
			{ status: 502 }
		);
	}

	return NextResponse.json(payload, {
		status: shopifyResponse.ok ? 200 : shopifyResponse.status,
	});
}
