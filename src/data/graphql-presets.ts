export type GraphqlPreset = {
	id: string;
	label: string;
	query: string;
	variables?: string;
};

export const GRAPHQL_PRESETS: GraphqlPreset[] = [
	{
		id: "shop",
		label: "Shop name",
		query: `{
  shop {
    name
    email
    myshopifyDomain
    currencyCode
    plan {
      displayName
    }
  }
}`,
	},
	{
		id: "products",
		label: "Products (first 5)",
		query: `{
  products(first: 5) {
    edges {
      node {
        id
        title
        handle
        status
        createdAt
      }
    }
  }
}`,
	},
	{
		id: "themes",
		label: "Themes",
		query: `{
  themes(first: 10) {
    edges {
      node {
        id
        name
        role
        createdAt
      }
    }
  }
}`,
	},
	{
		id: "metafield-definitions",
		label: "Metafield definitions",
		query: `{
  metafieldDefinitions(first: 10, ownerType: PRODUCT) {
    edges {
      node {
        id
        namespace
        key
        name
        type {
          name
        }
      }
    }
  }
}`,
	},
	{
		id: "product-by-handle",
		label: "Product by handle",
		query: `query ProductByHandle($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    handle
    description
    variants(first: 5) {
      edges {
        node {
          id
          title
          sku
          price
        }
      }
    }
  }
}`,
		variables: JSON.stringify({ handle: "your-product-handle" }, null, 2),
	},
];
