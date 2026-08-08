const GENERATION_MODEL = "@cf/zai-org/glm-4.7-flash";

type GenerationResult = {
	choices?: Array<{
		message?: {
			content?: string;
		};
	}>;
};

export async function generateTestAnswer(
	ai: Ai,
	question: string,
): Promise<string> {
	const result = await ai.run(GENERATION_MODEL, {
		messages: [
			{
				role: "system",
				content:
					"You are Sajad's AI portfolio assistant. Do not pretend to be Sajad.",
			},
			{
				role: "user",
				content: question,
			},
		],
	});

	const generationResult =
		result as unknown as GenerationResult;

	const answer =
		generationResult.choices?.[0]?.message?.content?.trim();

	if (!answer) {
		throw new Error(
			"Generation model did not return an answer.",
		);
	}

	return answer;
}