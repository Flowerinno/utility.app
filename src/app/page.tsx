import Link from "next/link";
import { ROUTES } from "@/lib";

const tools = [
	{
		title: "Env → JSON",
		description: "Paste .env content and convert it into clean JSON in one click.",
		href: ROUTES.envToJson,
	},
	{
		title: "Shopify Snippets",
		description: "Browse and copy Liquid debug snippets for products, collections, and customers.",
		href: ROUTES.shopify_snippets,
	},
	{
		title: "Shopify Token",
		description:
			"Authorize in Shopify, paste the redirect code, and exchange it for an Admin API access token.",
		href: ROUTES.shopify_token,
	},
	{
		title: "Verify Token",
		description:
			"Check whether a Shopify Admin access token belongs to a given shop via GraphQL.",
		href: ROUTES.verify_token,
	},
] as const;

export default function Home() {
	return (
		<main className="app-main animate-fade-up">
			<section className="mb-10 sm:mb-12">
				<p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
					Personal utilities
				</p>
				<h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
					Utilito
				</h1>
				<p className="page-subtitle mt-3 text-base sm:text-lg">
					A focused set of everyday tools — convert env files, grab Shopify
					Liquid snippets, fetch Admin API tokens, and verify tokens against a
					shop without leaving the browser.
				</p>
			</section>

			<section
				aria-label="Available tools"
				className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
			>
				{tools.map((tool, index) => (
					<Link
						key={tool.href}
						href={tool.href}
						className="panel group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-lift"
						style={{ animationDelay: `${index * 60}ms` }}
					>
						<h2 className="text-lg font-semibold text-ink group-hover:text-accent transition-colors">
							{tool.title}
						</h2>
						<p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
							{tool.description}
						</p>
						<span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
							Open tool
							<span
								aria-hidden
								className="transition-transform duration-200 group-hover:translate-x-0.5"
							>
								→
							</span>
						</span>
					</Link>
				))}
			</section>
		</main>
	);
}
