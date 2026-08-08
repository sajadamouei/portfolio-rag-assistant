import { readFile } from "node:fs/promises";
import path from "node:path";

type EvaluationQuestion = {
	id: string;
	question: string;
	language: string;
	answerable: boolean;
	expectedSourceIds: string[];
	expectedSections: string[];
};

type RetrievalResponse = {
	query: string;
	matches: {
		count: number;
		matches: Array<{
			id: string;
			score: number;
			metadata?: {
				sourceId?: string;
				section?: string;
			};
		}>;
	};
};

const evaluationPath = path.resolve(
	"evaluation/retrieval-questions.json",
);

const RETRIEVAL_URL = "http://127.0.0.1:8787/retrieve-test";

async function main() {
	const raw = await readFile(evaluationPath, "utf8");

	const questions = JSON.parse(raw) as EvaluationQuestion[];

	let evaluated = 0;
	let hitAt1 = 0;
	let hitAt3 = 0;

	for (const item of questions) {
		if (!item.answerable) {
			console.log(
				`${item.id}: skipped (unanswerable — threshold not implemented yet)`,
			);
			continue;
		}

		const url =
			`${RETRIEVAL_URL}?q=${encodeURIComponent(item.question)}`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Retrieval failed for ${item.id}: ${response.status} ${await response.text()}`,
			);
		}

		const result = (await response.json()) as RetrievalResponse;

		const retrievedSections = result.matches.matches
			.map((match) => match.metadata?.section)
			.filter((section): section is string => Boolean(section));

		const firstSection = retrievedSections[0];

		const isHitAt1 =
			firstSection !== undefined &&
			item.expectedSections.includes(firstSection);

		const isHitAt3 = retrievedSections
			.slice(0, 3)
			.some((section) =>
				item.expectedSections.includes(section),
			);

		evaluated++;

		if (isHitAt1) hitAt1++;
		if (isHitAt3) hitAt3++;

		console.log(`\n${item.id}: ${item.question}`);
		console.log(
			`Expected: ${item.expectedSections.join(", ")}`,
		);
		console.log(
			`Retrieved: ${retrievedSections.join(" → ")}`,
		);
		console.log(
			`Hit@1: ${isHitAt1 ? "YES" : "NO"} | Hit@3: ${
				isHitAt3 ? "YES" : "NO"
			}`,
		);
	}

	console.log("\n------------------------------");
	console.log("Retrieval evaluation summary");
	console.log("------------------------------");
	console.log(`Answerable questions: ${evaluated}`);

	console.log(
		`Hit@1: ${hitAt1}/${evaluated} (${(
			(hitAt1 / evaluated) *
			100
		).toFixed(1)}%)`,
	);

	console.log(
		`Hit@3: ${hitAt3}/${evaluated} (${(
			(hitAt3 / evaluated) *
			100
		).toFixed(1)}%)`,
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});