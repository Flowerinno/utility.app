import { ShopifyMetafieldBuilder } from "@/components/ShopifyMetafieldBuilder";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Metafield Builder | Utilito",
	description:
		"Build Shopify metafield definition JSON and TOML for Admin API or shopify.app.toml.",
};

export default function Page() {
	return <ShopifyMetafieldBuilder />;
}
