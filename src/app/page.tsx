import Link from "next/link";
import { getToolsByCategory, TOOL_CATEGORIES, type ToolCategory } from "@/lib";

const CATEGORY_ORDER: ToolCategory[] = ["shopify", "general"];

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
					A focused Shopify developer toolkit — debug Liquid, verify webhooks,
					fetch and verify tokens, run GraphQL, and handle everyday env
					conversions.
				</p>
			</section>

			{CATEGORY_ORDER.map((category) => {
				const tools = getToolsByCategory(category);
				const meta = TOOL_CATEGORIES[category];

				return (
					<section key={category} className="mb-10 last:mb-0">
						<div className="mb-4">
							<h2 className="text-lg font-semibold text-ink">{meta.label}</h2>
							<p className="mt-1 text-sm text-ink-muted">{meta.description}</p>
						</div>

						<div
							aria-label={`${meta.label} tools`}
							className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
						>
							{tools.map((tool, index) => (
								<Link
									key={tool.href}
									href={tool.href}
									className="panel group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-lift"
									style={{ animationDelay: `${index * 60}ms` }}
								>
									<h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-accent">
										{tool.title}
									</h3>
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
						</div>
					</section>
				);
			})}
		</main>
	);
}
