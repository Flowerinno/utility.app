import { ShopifyToken } from "@/components/ShopifyToken";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Shopify Token | Utilito",
	description:
		"Exchange a Shopify OAuth authorization code for an Admin API access token.",
	robots: { index: false },
};

export default function Page() {
	return <ShopifyToken />;
}
