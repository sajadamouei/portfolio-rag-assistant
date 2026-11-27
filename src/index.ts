/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { retrieveKnowledge } from "./rag/retrieve";
import {
	generateGroundedAnswer,
	generateTestAnswer,
} from "./rag/generate";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const { pathname } = url;

		if (request.method === "GET" && pathname === "/") {
			return new Response("Hello World!");
		}

		if (request.method === "GET" && pathname === "/health") {
			return Response.json({
				status: "ok",
				service: "portfolio-rag-assistant",
			});
		}

		if (url.pathname === "/rag-test") {
			const question = url.searchParams.get("q")?.trim();

			if (!question) {
				return Response.json(
					{ error: "Missing q query parameter." },
					{ status: 400 },
				);
			}

			const retrieval = await retrieveKnowledge(
				env,
				question,
				3,
			);

			const answer = await generateGroundedAnswer(
				env.AI,
				question,
				retrieval.matches,
			);

			return Response.json({
				question,
				answer,
				sources: retrieval.matches.map((match, index) => ({
					number: index + 1,
					id: match.id,
					score: match.score,
					sourceId: match.metadata?.sourceId,
					title: match.metadata?.title,
					section: match.metadata?.section,
				})),
			});
		}

		if (url.pathname === "/generate-test") {
			const question = url.searchParams.get("q")?.trim();

			if (!question) {
				return Response.json(
					{ error: "Missing q query parameter." },
					{ status: 400 },
				);
			}

			const answer = await generateTestAnswer(
				env.AI,
				question,
			);

			return Response.json({
				question,
				answer,
			});
		}

		if (request.method === "GET" && pathname === "/retrieve-test") {
			const query = url.searchParams.get("q")?.trim();

			if (!query) {
				return Response.json(
					{ error: "Missing query parameter: q" },
					{ status: 400 },
				);
			}

			const matches = await retrieveKnowledge(env, query, 3);

			return Response.json({
				query,
				matches,
			});
		}

		return Response.json({ error: "Not found" }, { status: 404 });
	},
} satisfies ExportedHandler<Env>;
