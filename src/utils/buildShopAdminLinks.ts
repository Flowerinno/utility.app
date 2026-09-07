import { buildAuthorizeUrl, normalizeShop } from "@/utils";

export type AdminLink = {
	label: string;
	url: string;
	description?: string;
};

export function buildShopAdminLinks(
	shop: string,
	options: {
		themeId?: string;
		clientId?: string;
		redirectUri?: string;
	} = {}
): AdminLink[] | null {
	const subdomain = normalizeShop(shop);
	if (!subdomain) return null;

	const storeBase = `https://admin.shopify.com/store/${subdomain}`;
	const legacyBase = `https://${subdomain}.myshopify.com/admin`;
	const storefront = `https://${subdomain}.myshopify.com`;

	const links: AdminLink[] = [
		{ label: "Admin home", url: storeBase },
		{ label: "Products", url: `${storeBase}/products` },
		{ label: "Orders", url: `${storeBase}/orders` },
		{ label: "Customers", url: `${storeBase}/customers` },
		{ label: "Themes", url: `${storeBase}/themes` },
		{
			label: "Settings",
			url: `${storeBase}/settings`,
		},
		{
			label: "Apps",
			url: `${storeBase}/settings/apps`,
		},
		{
			label: "GraphiQL",
			url: `${legacyBase}/api/graphiql`,
			description: "Admin API GraphQL explorer",
		},
		{
			label: "Storefront",
			url: storefront,
			description: "Live storefront preview",
		},
	];

	if (options.themeId?.trim()) {
		const themeId = options.themeId.trim();
		links.push({
			label: "Theme editor",
			url: `${storeBase}/themes/${themeId}/editor`,
		});
	}

	const authorizeUrl = buildAuthorizeUrl(
		shop,
		options.clientId || "",
		options.redirectUri || "http://localhost"
	);
	if (authorizeUrl) {
		links.push({
			label: "OAuth authorize",
			url: authorizeUrl,
			description: "Start OAuth flow for this app",
		});
	}

	return links;
}
