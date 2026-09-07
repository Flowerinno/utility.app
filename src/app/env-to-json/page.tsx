import EnvToJson from "@/components/EnvToJson";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Env → JSON | Utilito",
	description: "Convert .env file content into clean JSON in one click.",
};

export default function Page() {
	return <EnvToJson />;
}
