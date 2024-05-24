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

	return (
		<div className="flex flex-col items-center p-3">
			<div className="flex flex-row gap-5 p-3 w-full">
				<textarea
					name="ENVS"
					id="ENVS"
					placeholder="Enter your envs here"
					value={env}
					onChange={(e) => setEnv(e.target.value)}
					className="bg-white w-6/12 h-[600px] text-black p-2 rounded-md"
				/>
				<div className="flex flex-col gap-2">
					<button
						className="border-2 border-white p-1 rounded-md hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
						onClick={convert}
					>
						Convert
					</button>
					<button
						className="border-2 border-green-400 p-1 rounded-md hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
						onClick={copyResult}
					>
						Copy
					</button>
					<button
						className="border-2 border-red-400 p-1 rounded-md hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
						onClick={() => {
							setEnv("");
							setJson("");
						}}
					>
						Reset
					</button>
				</div>
				<div
					id="result"
					className="bg-white w-6/12 h-[600px] rounded-md text-black p-2 overflow-auto"
				>
					<pre>{json ?? "Result will appear here"}</pre>
				</div>
			</div>
		</div>
	);
};

export default EnvToJson;
