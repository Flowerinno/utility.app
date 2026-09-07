import { ShopifyAdminLinks } from "@/components/ShopifyAdminLinks";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Shop Admin Links | Utilito",
	description:
		"Generate Shopify admin, theme editor, GraphiQL, and storefront URLs from a shop handle.",
};

export default function Page() {
	return <ShopifyAdminLinks />;
}
