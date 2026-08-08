import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { knowledgeChunkSchema } from "../src/knowledge/schema";

const MODEL = "@cf/baai/bge-m3";
const VECTOR_DIMENSIONS = 1024;

const inputPath = path.resolve("generated/knowledge-chunks.json");
const outputPath = path.resolve("generated/vector-records.ndjson");

function requireEnv(name: string): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing environment variable: ${name}`);
	}

	return value;
}

type WorkersAiResponse = {
	success: boolean;
	result?: {
		shape?: number[];
		data?: number[][];
	};
	errors?: Array<{
		message?: string;
	}>;
};

async function main() {
	const accountId = requireEnv("CLOUDFLARE_ACCOUNT_ID");
	const apiToken = requireEnv("CLOUDFLARE_API_TOKEN");

	const raw = await readFile(inputPath, "utf8");

	const chunks = knowledgeChunkSchema
		.array()
		.parse(JSON.parse(raw));

	console.log(`Loaded ${chunks.length} knowledge chunks.`);

	const embeddingTexts = chunks.map(
		(chunk) =>
			`Title: ${chunk.title}\nSection: ${chunk.section}\n\n${chunk.text}`,
	);

	const response = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: embeddingTexts,
			}),
		},
	);

	if (!response.ok) {
		throw new Error(
			`Workers AI request failed: ${response.status} ${await response.text()}`,
		);
	}

	const payload = (await response.json()) as WorkersAiResponse;

	const embeddings = payload.result?.data;

	if (!payload.success || !embeddings) {
		throw new Error(
			`Workers AI did not return embeddings: ${JSON.stringify(payload.errors)}`,
		);
	}

	if (embeddings.length !== chunks.length) {
		throw new Error(
			`Expected ${chunks.length} embeddings but received ${embeddings.length}.`,
		);
	}

	for (const embedding of embeddings) {
		if (embedding.length !== VECTOR_DIMENSIONS) {
			throw new Error(
				`Expected ${VECTOR_DIMENSIONS} dimensions but received ${embedding.length}.`,
			);
		}
	}

	const records = chunks.map((chunk, index) => ({
		id: chunk.id,
		values: embeddings[index],
		metadata: {
			sourceId: chunk.sourceId,
			sourceType: chunk.sourceType,
			language: chunk.language,
			title: chunk.title,
			section: chunk.section,
			text: chunk.text,
			...(chunk.lastVerified
				? { lastVerified: chunk.lastVerified }
				: {}),
			...(chunk.links.paper
				? { paperUrl: chunk.links.paper }
				: {}),
			...(chunk.links.repository
				? { repositoryUrl: chunk.links.repository }
				: {}),
			...(chunk.links.portfolio
				? { portfolioUrl: chunk.links.portfolio }
				: {}),
			...(chunk.links.liveDemo
				? { liveDemoUrl: chunk.links.liveDemo }
				: {}),
		},
	}));

	const ndjson =
		records.map((record) => JSON.stringify(record)).join("\n") + "\n";

	await writeFile(outputPath, ndjson, "utf8");

	console.log(`Generated ${records.length} vector records.`);
	console.log(`Vector dimensions: ${VECTOR_DIMENSIONS}`);
	console.log(`Output: ${outputPath}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});