import { ShopifySnippets } from "@/components/ShopifySnippets";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Shopify Snippets | Utilito",
	description:
		"Browse and copy Liquid debug snippets for Shopify products, collections, cart, and more.",
};

export default function Page() {
	return <ShopifySnippets />;
}
