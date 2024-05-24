export const envToJson = (ENVs: string) => {
	try {
		if (!ENVs.length) return false;

		const filteredVariables = filterFileContents(ENVs);

		const object = arrayToJson(filteredVariables);

		prettyPrint(object);
		return JSON.stringify(object, null, 2);
	} catch (error) {
		//@ts-expect-error
		throw new Error(error?.message ?? "Error reading file");
	}
};

const prettyPrint = (data: any) => {
	console.log(JSON.stringify(data, null, "2"));
};

const filterFileContents = (s: string) => {
	let VARIABLES = s
		.split("\n")
		.map((line) => {
			if (line.startsWith("#")) {
				return "";
			}
			if (line.includes("#")) {
				const index = line.indexOf("#");
				const newLine = line.slice(0, index);
				return newLine.trim();
			}
			return line.trim();
		})
		.filter((v) => {
			if (v !== "" && !v.startsWith("#")) {
				return true;
			}
			return false;
		});

	return VARIABLES;
};

const arrayToJson = (arr: string[]) => {
	const object: Record<string, string> = {};

	arr.forEach((item) => {
		const [k, v] = item.split("=");
		object[k.trim()] = v.trim();
	});

	return object;
};
