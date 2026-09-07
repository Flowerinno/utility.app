import { ROUTES } from "./routes";

export type ToolCategory = "shopify" | "general";

export type Tool = {
	id: string;
	title: string;
	description: string;
	href: string;
	category: ToolCategory;
	navLabel?: string;
};

export const TOOL_CATEGORIES: Record<
	ToolCategory,
	{ label: string; description: string }
> = {
	shopify: {
		label: "Shopify",
		description: "Theme debugging, OAuth, webhooks, and Admin API tools.",
	},
	general: {
		label: "General",
		description: "Everyday developer utilities.",
	},
};

export const TOOLS: Tool[] = [
	{
		id: "env-to-json",
		title: "Env → JSON",
		description:
			"Paste .env content and convert it into clean JSON in one click.",
		href: ROUTES.envToJson,
		category: "general",
	},
	{
		id: "shopify-snippets",
		title: "Shopify Snippets",
		description:
			"Browse and copy Liquid debug snippets for products, collections, cart, and more.",
		href: ROUTES.shopify_snippets,
		category: "shopify",
	},
	{
		id: "shopify-token",
		title: "Shopify Token",
		description:
			"Authorize in Shopify, paste the redirect code, and exchange it for an Admin API access token.",
		href: ROUTES.shopify_token,
		category: "shopify",
	},
	{
		id: "verify-token",
		title: "Verify Token",
		description:
			"Check whether a Shopify Admin access token belongs to a given shop via GraphQL.",
		href: ROUTES.verify_token,
		category: "shopify",
	},
	{
		id: "shopify-webhook-hmac",
		title: "Webhook HMAC",
		description:
			"Verify X-Shopify-Hmac-Sha256 signatures against a raw webhook body.",
		href: ROUTES.shopify_webhook_hmac,
		category: "shopify",
		navLabel: "Webhook HMAC",
	},
	{
		id: "shopify-links",
		title: "Shop Admin Links",
		description:
			"Generate admin, theme editor, GraphiQL, and storefront URLs from a shop handle.",
		href: ROUTES.shopify_links,
		category: "shopify",
		navLabel: "Admin Links",
	},
	{
		id: "shopify-graphql",
		title: "GraphQL Playground",
		description:
			"Run Admin API GraphQL queries against a shop with a pasted access token.",
		href: ROUTES.shopify_graphql,
		category: "shopify",
		navLabel: "GraphQL",
	},
	{
		id: "shopify-metafields",
		title: "Metafield Builder",
		description:
			"Build metafield definition JSON and TOML for Admin API or shopify.app.toml.",
		href: ROUTES.shopify_metafields,
		category: "shopify",
		navLabel: "Metafields",
	},
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
	return TOOLS.filter((tool) => tool.category === category);
}

export function getNavTools(): Tool[] {
	return TOOLS;
}

export function getToolNavLabel(tool: Tool): string {
	return tool.navLabel ?? tool.title;
}
