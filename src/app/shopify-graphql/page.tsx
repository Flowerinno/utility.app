import { ShopifyGraphql } from "@/components/ShopifyGraphql";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "GraphQL Playground | Utilito",
	description:
		"Run Shopify Admin API GraphQL queries against a shop with a pasted access token.",
	robots: { index: false },
};

export default function Page() {
	return <ShopifyGraphql />;
}
