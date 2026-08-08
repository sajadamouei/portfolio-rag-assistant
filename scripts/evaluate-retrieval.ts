import { readFile } from "node:fs/promises";
import path from "node:path";

type RequiredEvidence = {
	sourceId: string;
	sections: string[];
};

type EvaluationQuestion = {
	id: string;
	question: string;
	language: string;
	answerable: boolean;
	expectedSourceIds: string[];
	expectedSections: string[];
	requiredEvidence?: RequiredEvidence[];
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

	let sourceHitAt1 = 0;
	let sourceHitAt3 = 0;

	let hitAt1 = 0;
	let hitAt3 = 0;

	let multiEvidenceEvaluated = 0;
	let fullCoverageAt3 = 0;

	let evidenceTargetsFound = 0;
	let totalEvidenceTargets = 0;

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

		const retrievedMatches = result.matches.matches.map((match) => ({
			sourceId: match.metadata?.sourceId,
			section: match.metadata?.section,
		}));

		if (item.requiredEvidence?.length) {
			const top3 = retrievedMatches.slice(0, 3);

			const coveredEvidence = item.requiredEvidence.filter((required) =>
				top3.some(
					(match) =>
						match.sourceId === required.sourceId &&
						match.section !== undefined &&
						required.sections.includes(match.section),
				),
			);

			const coveredCount = coveredEvidence.length;
			const requiredCount = item.requiredEvidence.length;

			const isFullCoverageAt3 =
				coveredCount === requiredCount;

			multiEvidenceEvaluated++;
			evidenceTargetsFound += coveredCount;
			totalEvidenceTargets += requiredCount;

			if (isFullCoverageAt3) {
				fullCoverageAt3++;
			}

			console.log(`\n${item.id}: ${item.question}`);

			console.log(
				`Retrieved: ${retrievedMatches
					.map(
						(match) =>
							`${match.sourceId ?? "unknown"} / ${match.section ?? "unknown"}`,
					)
					.join(" → ")}`,
			);

			console.log(
				`Evidence coverage@3: ${coveredCount}/${requiredCount}`,
			);

			console.log(
				`Full coverage@3: ${isFullCoverageAt3 ? "YES" : "NO"}`,
			);

			continue;
		}

		const isExpectedSource = (
			match: { sourceId?: string },
		) =>
			match.sourceId !== undefined &&
			item.expectedSourceIds.includes(match.sourceId);

		const isSourceHitAt1 =
			retrievedMatches[0] !== undefined &&
			isExpectedSource(retrievedMatches[0]);

		const isSourceHitAt3 = retrievedMatches
			.slice(0, 3)
			.some(isExpectedSource);

		const isExpectedMatch = (
			match: { sourceId?: string; section?: string },
		) =>
			match.sourceId !== undefined &&
			match.section !== undefined &&
			item.expectedSourceIds.includes(match.sourceId) &&
			item.expectedSections.includes(match.section);

		const isHitAt1 =
			retrievedMatches[0] !== undefined &&
			isExpectedMatch(retrievedMatches[0]);

		const isHitAt3 = retrievedMatches
			.slice(0, 3)
			.some(isExpectedMatch);

		evaluated++;

		if (isSourceHitAt1) sourceHitAt1++;
		if (isSourceHitAt3) sourceHitAt3++;

		if (isHitAt1) hitAt1++;
		if (isHitAt3) hitAt3++;

		console.log(`\n${item.id}: ${item.question}`);
		console.log(
			`Expected: ${item.expectedSections.join(", ")}`,
		);
		console.log(
			`Retrieved: ${retrievedMatches
				.map(
					(match) =>
						`${match.sourceId ?? "unknown"} / ${match.section ?? "unknown"}`,
				)
				.join(" → ")}`,
		);
		console.log(
			`Hit@1: ${isHitAt1 ? "YES" : "NO"} | Hit@3: ${
				isHitAt3 ? "YES" : "NO"
			}`,
		);

		console.log(
			`Source@1: ${isSourceHitAt1 ? "YES" : "NO"} | Source@3: ${
				isSourceHitAt3 ? "YES" : "NO"
			}`,
		);
	}

	console.log("\n------------------------------");
	console.log("Retrieval evaluation summary");
	console.log("------------------------------");
	console.log(`Answerable questions: ${evaluated}`);

	console.log(
		`Source@1: ${sourceHitAt1}/${evaluated} (${(
			(sourceHitAt1 / evaluated) *
			100
		).toFixed(1)}%)`,
	);

	console.log(
		`Source@3: ${sourceHitAt3}/${evaluated} (${(
			(sourceHitAt3 / evaluated) *
			100
		).toFixed(1)}%)`,
	);

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

	if (multiEvidenceEvaluated > 0) {
		console.log("\n------------------------------");
		console.log("Multi-evidence evaluation");
		console.log("------------------------------");

		console.log(
			`Multi-evidence questions: ${multiEvidenceEvaluated}`,
		);

		console.log(
			`EvidenceCoverage@3: ${evidenceTargetsFound}/${totalEvidenceTargets} (${(
				(evidenceTargetsFound / totalEvidenceTargets) *
				100
			).toFixed(1)}%)`,
		);

		console.log(
			`FullCoverage@3: ${fullCoverageAt3}/${multiEvidenceEvaluated} (${(
				(fullCoverageAt3 / multiEvidenceEvaluated) *
				100
			).toFixed(1)}%)`,
		);
	}
	
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});