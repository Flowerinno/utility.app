import { ShopifyWebhookHmac } from "@/components/ShopifyWebhookHmac";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Webhook HMAC Verifier | Utilito",
	description:
		"Verify Shopify webhook X-Shopify-Hmac-Sha256 signatures against a raw request body.",
	robots: { index: false },
};

export default function Page() {
	return <ShopifyWebhookHmac />;
}
