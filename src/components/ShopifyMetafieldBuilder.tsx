"use client";

import { useMemo, useState } from "react";
import {
	buildMetafieldAdminApiPayload,
	buildMetafieldToml,
	METAFIELD_OWNER_TYPES,
	METAFIELD_TYPES,
	type MetafieldFormValues,
	type MetafieldOwnerType,
} from "@/data/metafield-types";
import { notify } from "@/utils";

const DEFAULT_VALUES: MetafieldFormValues = {
	namespace: "custom",
	key: "my_field",
	name: "My field",
	description: "",
	type: "single_line_text_field",
	ownerType: "PRODUCT",
	pin: false,
};

export function ShopifyMetafieldBuilder() {
	const [values, setValues] = useState<MetafieldFormValues>(DEFAULT_VALUES);
	const [activeTab, setActiveTab] = useState<"json" | "toml">("json");

	const jsonOutput = useMemo(
		() => JSON.stringify(buildMetafieldAdminApiPayload(values), null, 2),
		[values]
	);
	const tomlOutput = useMemo(() => buildMetafieldToml(values), [values]);

	function update<K extends keyof MetafieldFormValues>(
		key: K,
		value: MetafieldFormValues[K]
	) {
		setValues((prev) => ({ ...prev, [key]: value }));
	}

	const copyOutput = () => {
		const text = activeTab === "json" ? jsonOutput : tomlOutput;
		navigator.clipboard.writeText(text);
		notify("Copied to clipboard", "success");
	};

	return (
		<main className="app-main animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">Metafield Builder</h1>
				<p className="page-subtitle">
					Build metafield definition JSON for the Admin API or TOML for
					shopify.app.toml — no API calls, copy and use in your project.
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="panel space-y-4 p-5">
					<label className="flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Namespace
						</span>
						<input
							className="field font-mono"
							value={values.namespace}
							onChange={(e) => update("namespace", e.target.value)}
						/>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Key
						</span>
						<input
							className="field font-mono"
							value={values.key}
							onChange={(e) => update("key", e.target.value)}
						/>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Name
						</span>
						<input
							className="field"
							value={values.name}
							onChange={(e) => update("name", e.target.value)}
						/>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Description
						</span>
						<input
							className="field"
							value={values.description}
							onChange={(e) => update("description", e.target.value)}
							placeholder="Optional"
						/>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Type
						</span>
						<select
							className="field"
							value={values.type}
							onChange={(e) => update("type", e.target.value)}
						>
							{METAFIELD_TYPES.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
							Owner type
						</span>
						<select
							className="field"
							value={values.ownerType}
							onChange={(e) =>
								update("ownerType", e.target.value as MetafieldOwnerType)
							}
						>
							{METAFIELD_OWNER_TYPES.map((owner) => (
								<option key={owner.value} value={owner.value}>
									{owner.label}
								</option>
							))}
						</select>
					</label>

					<label className="flex items-center gap-2 text-sm text-ink">
						<input
							type="checkbox"
							checked={values.pin}
							onChange={(e) => update("pin", e.target.checked)}
							className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
						/>
						Pin to admin (show on resource detail pages)
					</label>
				</div>

				<div className="flex flex-col gap-3">
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setActiveTab("json")}
							className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
								activeTab === "json"
									? "bg-accent text-white"
									: "bg-surface-muted text-ink-muted hover:text-ink"
							}`}
						>
							Admin API JSON
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("toml")}
							className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
								activeTab === "toml"
									? "bg-accent text-white"
									: "bg-surface-muted text-ink-muted hover:text-ink"
							}`}
						>
							shopify.app.toml
						</button>
						<button
							type="button"
							onClick={copyOutput}
							className="btn-secondary ml-auto !px-3 !py-1.5 text-xs"
						>
							Copy
						</button>
					</div>

					<pre className="code-panel flex-1 min-h-[420px] overflow-auto whitespace-pre-wrap p-4 text-sm">
						<code>{activeTab === "json" ? jsonOutput : tomlOutput}</code>
					</pre>
				</div>
			</div>
		</main>
	);
}
