"use client";
import { useState } from "react";
import { envToJson, notify } from "@/utils";

const EnvToJson = () => {
	const [env, setEnv] = useState("");
	const [json, setJson] = useState("");

	const convert = () => {
		try {
			const result = envToJson(env);

			if (!result) return;

			setJson(result);
		} catch (error) {
			notify("Wrong format", "error");
		}
	};

	const copyResult = () => {
		navigator.clipboard.writeText(json);
		notify("Copied to clipboard", "success");
	};

	const reset = () => {
		setEnv("");
		setJson("");
	};

	return (
		<main className="app-main animate-fade-up">
			<div className="mb-6">
				<h1 className="page-title">Env → JSON</h1>
				<p className="page-subtitle">
					Paste environment variables on the left, convert, then copy the JSON
					result.
				</p>
			</div>

			<div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
				<label className="flex min-h-[420px] flex-1 flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
						Input (.env)
					</span>
					<textarea
						name="ENVS"
						id="ENVS"
						placeholder={"API_KEY=...\nDEBUG=true\nPORT=3000"}
						value={env}
						onChange={(e) => setEnv(e.target.value)}
						className="field code-panel min-h-[420px] flex-1 resize-y p-4"
					/>
				</label>

				<div className="flex flex-row flex-wrap items-center justify-center gap-2 lg:w-36 lg:flex-col lg:justify-center lg:py-10">
					<button type="button" className="btn-primary w-full min-w-[7.5rem]" onClick={convert}>
						Convert
					</button>
					<button
						type="button"
						className="btn-success w-full min-w-[7.5rem]"
						onClick={copyResult}
						disabled={!json}
					>
						Copy
					</button>
					<button type="button" className="btn-danger w-full min-w-[7.5rem]" onClick={reset}>
						Reset
					</button>
				</div>

				<div className="flex min-h-[420px] flex-1 flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
						Output (JSON)
					</span>
					<div id="result" className="code-panel min-h-[420px] flex-1 p-4">
						{json ? (
							<pre className="whitespace-pre-wrap break-words">{json}</pre>
						) : (
							<p className="text-ink-muted">Result will appear here</p>
						)}
					</div>
				</div>
			</div>
		</main>
	);
};

export default EnvToJson;
