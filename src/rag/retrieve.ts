const EMBEDDING_MODEL = "@cf/baai/bge-m3";

type EmbeddingResult = {
	data?: number[][];
};

async function embedQuery(ai: Ai, text: string): Promise<number[]> {
	const result = await ai.run(EMBEDDING_MODEL, {
		text: [text],
	});

	const embeddingResult = result as unknown as EmbeddingResult;
	const vector = embeddingResult.data?.[0];

	if (!vector) {
		throw new Error("Embedding model did not return vector data.");
	}

	return vector;
}

export async function retrieveKnowledge(
	env: Env,
	query: string,
	topK = 3,
) {
	const queryVector = await embedQuery(env.AI, query);

	return env.VECTORIZE.query(queryVector, {
		topK,
		returnMetadata: "all",
	});
}