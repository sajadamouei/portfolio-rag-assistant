import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("portfolio RAG assistant worker", () => {
	it("returns Hello World! from GET /", async () => {
		const request = new IncomingRequest("http://example.com");
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("Hello World!");
	});

	it("returns service health from GET /health", async () => {
		const response = await SELF.fetch("https://example.com/health");

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			status: "ok",
			service: "portfolio-rag-assistant",
		});
	});

	it("returns 404 for an unknown route", async () => {
		const response = await SELF.fetch("https://example.com/unknown");

		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({ error: "Not found" });
	});
});
