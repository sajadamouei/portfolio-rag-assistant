import { z } from "zod";

/**
 * Empty URLs are allowed while content is still being prepared.
 */
const optionalSourceUrl = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }

    return value;
  },
  z.string().url().optional(),
);

const optionalDateString = z.preprocess(
  (value) => {
    if (value === null || value === undefined || value === "") {
      return undefined;
    }

    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }

    return value;
  },
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD")
    .optional(),
);

/**
 * These are the supported knowledge-source categories.
 */
export const sourceTypeSchema = z.enum([
  "research_project",
  "industry_project",
  "profile",
  "experience",
  "education",
  "skills",
  "faq",
]);

/**
 * Minimum metadata required from every Markdown source.
 *
 * passthrough() temporarily allows additional metadata such as:
 * publication_title, authors, doi and publication_year.
 */
export const sourceMetadataSchema = z
  .object({
    id: z.string().min(1, "Source id is required"),
    title: z.string().min(1, "Source title is required"),
    source_type: sourceTypeSchema,
    language: z.enum(["en", "no"]),

    last_verified: optionalDateString,

    paper_url: optionalSourceUrl,
    repository_url: optionalSourceUrl,
    portfolio_url: optionalSourceUrl,
    live_demo_url: optionalSourceUrl,
  })
  .passthrough();

/**
 * Structure produced by the ingestion pipeline.
 *
 * Each Markdown section will initially become one chunk.
 */
export const knowledgeChunkSchema = z.object({
  id: z.string().min(1),

  sourceId: z.string().min(1),
  sourceType: sourceTypeSchema,

  title: z.string().min(1),
  section: z.string().min(1),
  language: z.enum(["en", "no"]),

  text: z.string().min(1),

  lastVerified: z.string().optional(),

  links: z.object({
    paper: z.string().url().optional(),
    repository: z.string().url().optional(),
    portfolio: z.string().url().optional(),
    liveDemo: z.string().url().optional(),
  }),
});

export type SourceMetadata = z.infer<typeof sourceMetadataSchema>;
export type KnowledgeChunk = z.infer<typeof knowledgeChunkSchema>;