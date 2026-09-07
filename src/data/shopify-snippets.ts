export type Snippet = {
	title: string;
	code: string;
};

export type SnippetCategory = {
	name: string;
	snippets: Snippet[];
};

export const shopifySnippets: SnippetCategory[] = [
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
	{
		name: "Cart",
		snippets: [
			{
				title: "Console log Cart info",
				code: `
<script>
  console.table({
    item_count: {{ cart.item_count | json }},
    total_price: {{ cart.total_price | json }},
    total_price_formatted: {{ cart.total_price | money | json }},
    original_total_price: {{ cart.original_total_price | json }},
    note: {{ cart.note | json }},
    currency: {{ cart.currency.iso_code | json }},
    items: [
      {% for item in cart.items %}
        {
          id: {{ item.id | json }},
          product_id: {{ item.product_id | json }},
          variant_id: {{ item.variant_id | json }},
          title: {{ item.title | json }},
          quantity: {{ item.quantity | json }},
          line_price: {{ item.line_price | money | json }},
          properties: {{ item.properties | json }},
          selling_plan_allocation: {{ item.selling_plan_allocation | json }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ],
    cart_level_discount_applications: {{ cart.cart_level_discount_applications | json }}
  })
</script>`,
			},
			{
				title: "Console log line item properties",
				code: `
<script>
  {% for item in cart.items %}
    console.log("Line item {{ forloop.index }}", {
      title: {{ item.title | json }},
      properties: {{ item.properties | json }},
      variant: {{ item.variant.title | json }}
    });
  {% endfor %}
</script>`,
			},
		],
	},
	{
		name: "Shop",
		snippets: [
			{
				title: "Console log Shop info",
				code: `
<script>
  console.table({
    name: {{ shop.name | json }},
    domain: {{ shop.domain | json }},
    permanent_domain: {{ shop.permanent_domain | json }},
    currency: {{ shop.currency | json }},
    money_format: {{ shop.money_format | json }},
    enabled_payment_types: {{ shop.enabled_payment_types | json }},
    metafields: "shop.metafields.{namespace}.{key}.value"
  })
</script>`,
			},
		],
	},
	{
		name: "Article / Blog",
		snippets: [
			{
				title: "Console log Article info",
				code: `
<script>
  console.table({
    id: {{ article.id | json }},
    title: {{ article.title | json }},
    handle: {{ article.handle | json }},
    author: {{ article.author | json }},
    published_at: {{ article.published_at | json }},
    blog_handle: {{ blog.handle | json }},
    url: {{ article.url | json }},
    tags: {{ article.tags | json }},
    comments_count: {{ article.comments_count | json }},
    metafields: "article.metafields.{namespace}.{key}.value"
  })
</script>`,
			},
			{
				title: "Console log Blog info",
				code: `
<script>
  console.table({
    id: {{ blog.id | json }},
    title: {{ blog.title | json }},
    handle: {{ blog.handle | json }},
    url: {{ blog.url | json }},
    articles_count: {{ blog.articles_count | json }}
  })
</script>`,
			},
		],
	},
	{
		name: "Search",
		snippets: [
			{
				title: "Console log Search results",
				code: `
<script>
  console.table({
    terms: {{ search.terms | json }},
    results_count: {{ search.results_count | json }},
    types: {{ search.types | json }},
    results: [
      {% for result in search.results %}
        {
          title: {{ result.title | json }},
          url: {{ result.url | json }},
          object_type: {{ result.object_type | json }},
          price: {{ result.price | money | json }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  })
</script>`,
			},
		],
	},
	{
		name: "Metaobjects",
		snippets: [
			{
				title: "Console log Metaobject fields",
				code: `
{% comment %} Use on a metaobject template or when metaobject is in scope {% endcomment %}
<script>
  console.table({
    type: {{ metaobject.type | json }},
    handle: {{ metaobject.handle | json }},
    system: {{ metaobject.system | json }},
    {% for field in metaobject.system.fields %}
      {{ field.key }}: {{ metaobject[field.key].value | json }},
    {% endfor %}
  })
</script>`,
			},
			{
				title: "Loop metaobjects by type",
				code: `
{% comment %} shop.metaobjects.{type}.values returns all entries of that type {% endcomment %}
<script>
  const entries = [
    {% for entry in shop.metaobjects['your_type'].values %}
      {
        handle: {{ entry.handle | json }},
        system: {{ entry.system | json }}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];
  console.table(entries);
</script>`,
			},
		],
	},
	{
		name: "Routes / Localization",
		snippets: [
			{
				title: "Console log Routes URLs",
				code: `
<script>
  console.table({
    root_url: {{ routes.root_url | json }},
    account_url: {{ routes.account_url | json }},
    account_login_url: {{ routes.account_login_url | json }},
    account_register_url: {{ routes.account_register_url | json }},
    cart_url: {{ routes.cart_url | json }},
    cart_add_url: {{ routes.cart_add_url | json }},
    search_url: {{ routes.search_url | json }},
    collections_url: {{ routes.collections_url | json }},
    all_products_collection_url: {{ routes.all_products_collection_url | json }}
  })
</script>`,
			},
			{
				title: "Console log Localization",
				code: `
<script>
  console.table({
    country: {{ localization.country.iso_code | json }},
    language: {{ localization.language.iso_code | json }},
    available_countries: {{ localization.available_countries | map: 'iso_code' | json }},
    available_languages: {{ localization.available_languages | map: 'iso_code' | json }}
  })
</script>`,
			},
		],
	},
];

export const snippetCategoryNames = shopifySnippets.map((c) => c.name);
