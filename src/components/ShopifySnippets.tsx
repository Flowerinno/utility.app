"use client";

import { useMemo, useState } from "react";

export function ShopifySnippets() {
	const [query, setQuery] = useState("");
	const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
	const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return snippets;
		return snippets
			.map((cat) => ({
				...cat,
				snippets: cat.snippets.filter((s) => {
					return (
						cat.name.toLowerCase().includes(q) ||
						s.title.toLowerCase().includes(q)
					);
				}),
			}))
			.filter((cat) => cat.snippets.length > 0);
	}, [query]);

	async function copyToClipboard(text: string, title: string) {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedTitle(title);
			setTimeout(() => setCopiedTitle(null), 1800);
		} catch (err) {
			console.error("Copy failed", err);
		}
	}

	return (
		<main className="app-main animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">Shopify Snippets</h1>
				<p className="page-subtitle">
					Search, expand, and copy Liquid debug snippets for common Shopify
					objects.
				</p>
			</div>

			<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
				<input
					aria-label="Search snippets"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="field flex-1"
					placeholder="Search by category or snippet title..."
				/>
				<button
					type="button"
					onClick={() => setQuery("")}
					className="btn-ghost self-start sm:self-auto"
					disabled={!query}
				>
					Clear
				</button>
			</div>

			{filtered.length === 0 ? (
				<p className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-8 text-center text-ink-muted">
					No snippets found.
				</p>
			) : (
				filtered.map((cat) => (
					<section key={cat.name} className="mb-8">
						<h2 className="mb-3 text-lg font-semibold text-ink">{cat.name}</h2>
						<div className="grid gap-3">
							{cat.snippets.map((s) => {
								const key = `${cat.name}||${s.title}`;
								const open = !!openMap[key];
								return (
									<div
										key={s.title}
										onClick={() =>
											setOpenMap((m) => ({ ...m, [key]: !m[key] }))
										}
										className="panel cursor-pointer p-4 transition-colors hover:border-accent"
									>
										<div
											className="flex items-center justify-between gap-3"
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													setOpenMap((m) => ({ ...m, [key]: !m[key] }));
												}
											}}
										>
											<div className="text-base font-medium text-ink">
												{s.title}
											</div>
											<div className="flex shrink-0 items-center gap-2">
												<button
													type="button"
													onClick={(ev) => {
														ev.stopPropagation();
														copyToClipboard(s.code, s.title);
													}}
													className="btn-secondary !px-3 !py-1.5 text-xs"
												>
													Copy
												</button>
												{copiedTitle === s.title && (
													<span className="text-xs font-medium text-success">
														Copied!
													</span>
												)}
												<svg
													className={`h-4 w-4 text-ink-muted transition-transform duration-200 ${
														open ? "rotate-180" : "rotate-0"
													}`}
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</div>
										</div>

										{open && (
											<pre className="code-panel mt-3 whitespace-pre-wrap p-3 text-sm">
												<code>{s.code.trim()}</code>
											</pre>
										)}
									</div>
								);
							})}
						</div>
					</section>
				))
			)}
		</main>
	);
}

const snippets = [
	{
		name: "Product",
		snippets: [
			{
				title: "Console log Product info",
				code: `
<script>
        console.table({
              id: {{product.id | json}},
              collections: {{product.collections | json}},
              title: {{product.title | json}},
              handle: {{product.handle | json}},
              vendor: {{product.vendor | json}},
              type: {{product.type | json}},
              tags: {{product.tags | json}},
              price: {{product.price | money | json}},
              compare_at_price: {{product.compare_at_price | money | json}},
              url: {{product.url | json}},
              available: {{product.available | json}},
              created_at: {{product.created_at | json}},
              updated_at: {{product.updated_at | json}},
              category: {{ product.category | json }},
              metafields: "product.metafields.{namespace}.{key}.value"
        })
      </script>
        `,
			},
		],
	},
	{
		name: "Collection",
		snippets: [
			{
				title: "Console log Collection info",
				code: `
<script>
        console.table({
              id: {{collection.id | json }},
              title: {{collection.title | json }},
              handle: {{collection.handle | json }},
              url: {{collection.url | json }},
              description: {{collection.description | json }},
              created_at: {{collection.created_at | json }},
              updated_at: {{collection.updated_at | json }},
              products_count: {{ collection.products_count | json }},
              default_sort_by: {{ collection.default_sort_by | json }},
              current_sort_by: {{ collection.sort_by | json }},
              all_tags: {{ collection.all_tags | json }},
              filters: [
                {% for filter in collection.filters %}
                  {
                    type: {{ filter.type | json }},
                    label: {{ filter.label | json }},
                    param_name: {{ filter.param_name | json }},
                    values: [
                      {% for value in filter.values %}
                        {
                          label: {{ value.label | json }},
                          value: {{ value.value | json }},
                          count: {{ value.count | json }},
                          active: {{ value.active | json }},
                          param_name: {{ value.param_name | json }},
                        }{% unless forloop.last %},{% endunless %}
                      {% endfor %}
                    ],
                    {% if filter.type == 'price_range' %}
                      min_value: {
                        value: {{ filter.min_value.value | json }},
                        param_name: {{ filter.min_value.param_name | json }},
                      },
                      max_value: {
                        value: {{ filter.max_value.value | json }},
                        param_name: {{ filter.max_value.param_name | json }},
                      },
                      range_max: {{ filter.range_max | json }},
                    {% endif %}
                  }{% unless forloop.last %},{% endunless %}
                {% endfor %}
              ],
              metafields: "collection.metafields.{namespace}.{key}.value"

        })
      </script>`,
			},
		],
	},
	{
		name: "Customer",
		snippets: [
			{
				title: "Console log Customer info",
				code: `
<script>
  console.table({
   id: {{ customer.id | json }},
   total_spent: {{ customer.total_spent | json }},
   total_spent_in_dollars: {{ customer.total_spent | divided_by: 100.0 | json }},
   orders_count: {{ customer.orders.size | json }},
   first_name: {{ customer.first_name | json }},
   last_name: {{ customer.last_name | json }},
   email: {{ customer.email | json }},
   tags: {{ customer.tags | json }},
   is_logged_in: "if customer",
   orders: [
      {% for order in customer.orders %}
        {
          id: {{ order.id | json }},
          name: {{ order.name | json }},
          total_price: {{ order.total_price | json }},
          total_price_in_dollars: {{ order.total_price | divided_by: 100.0 | json }},
          created_at: "{{ order.created_at}}",
          financial_status: {{ order.financial_status | json }},
          fulfillment_status: {{ order.fulfillment_status | json }},
          line_items: [
            {% for line_item in order.line_items %}
              {
                id: {{ line_item.id | json }},
                title: {{ line_item.title | json }},
                quantity: {{ line_item.quantity | json }},
                fulfillment: {
                  tracking_number: {{ line_item.fulfillment.tracking_number | json }},
                  tracking_url: {{ line_item.fulfillment.tracking_url | json }}
                }
              }{% unless forloop.last %},{% endunless %}
            {% endfor %}
          ]
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
   ]
  })
</script>
        `,
			},
		],
	},
];
