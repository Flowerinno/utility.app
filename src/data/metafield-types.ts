export type MetafieldOwnerType =
	| "PRODUCT"
	| "PRODUCTVARIANT"
	| "COLLECTION"
	| "CUSTOMER"
	| "ORDER"
	| "SHOP"
	| "PAGE"
	| "ARTICLE"
	| "BLOG";

export const METAFIELD_OWNER_TYPES: { value: MetafieldOwnerType; label: string }[] =
	[
		{ value: "PRODUCT", label: "Product" },
		{ value: "PRODUCTVARIANT", label: "Product variant" },
		{ value: "COLLECTION", label: "Collection" },
		{ value: "CUSTOMER", label: "Customer" },
		{ value: "ORDER", label: "Order" },
		{ value: "SHOP", label: "Shop" },
		{ value: "PAGE", label: "Page" },
		{ value: "ARTICLE", label: "Article" },
		{ value: "BLOG", label: "Blog" },
	];

export const METAFIELD_TYPES: { value: string; label: string }[] = [
	{ value: "single_line_text_field", label: "Single line text" },
	{ value: "multi_line_text_field", label: "Multi line text" },
	{ value: "number_integer", label: "Integer" },
	{ value: "number_decimal", label: "Decimal" },
	{ value: "boolean", label: "Boolean" },
	{ value: "date", label: "Date" },
	{ value: "date_time", label: "Date time" },
	{ value: "url", label: "URL" },
	{ value: "json", label: "JSON" },
	{ value: "color", label: "Color" },
	{ value: "rating", label: "Rating" },
	{ value: "money", label: "Money" },
	{ value: "dimension", label: "Dimension" },
	{ value: "volume", label: "Volume" },
	{ value: "weight", label: "Weight" },
	{ value: "file_reference", label: "File reference" },
	{ value: "page_reference", label: "Page reference" },
	{ value: "product_reference", label: "Product reference" },
	{ value: "variant_reference", label: "Variant reference" },
	{ value: "collection_reference", label: "Collection reference" },
	{ value: "metaobject_reference", label: "Metaobject reference" },
	{ value: "list.single_line_text_field", label: "List of single line text" },
	{ value: "list.product_reference", label: "List of product references" },
];

export type MetafieldFormValues = {
	namespace: string;
	key: string;
	name: string;
	description: string;
	type: string;
	ownerType: MetafieldOwnerType;
	pin: boolean;
};

export function buildMetafieldDefinitionJson(values: MetafieldFormValues) {
	const definition: Record<string, unknown> = {
		namespace: values.namespace,
		key: values.key,
		name: values.name,
		type: values.type,
		ownerType: values.ownerType,
	};

	if (values.description.trim()) {
		definition.description = values.description.trim();
	}

	if (values.pin) {
		definition.pin = true;
	}

	return {
		query: `mutation CreateMetafieldDefinition {
  metafieldDefinitionCreate(definition: ${JSON.stringify(definition, null, 2).replace(/"([^"]+)":/g, "$1:")}) {
    createdDefinition {
      id
      name
      namespace
      key
    }
    userErrors {
      field
      message
    }
  }
}`,
		variables: {
			definition,
		},
		definition,
	};
}

export function buildMetafieldToml(values: MetafieldFormValues): string {
	const lines = [
		"[[metafields]]",
		`namespace = "${values.namespace}"`,
		`key = "${values.key}"`,
		`name = "${values.name}"`,
		`type = "${values.type}"`,
		`owner_type = "${values.ownerType.toLowerCase()}"`,
	];

	if (values.description.trim()) {
		lines.push(`description = "${values.description.trim()}"`);
	}

	return lines.join("\n");
}

export function buildMetafieldAdminApiPayload(values: MetafieldFormValues) {
	return {
		metafieldDefinitionCreate: {
			definition: {
				namespace: values.namespace,
				key: values.key,
				name: values.name,
				...(values.description.trim()
					? { description: values.description.trim() }
					: {}),
				type: values.type,
				ownerType: values.ownerType,
				...(values.pin ? { pin: true } : {}),
			},
		},
	};
}
