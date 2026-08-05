import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

import {
  knowledgeChunkSchema,
  sourceMetadataSchema,
  type KnowledgeChunk,
  type SourceMetadata,
} from "../src/knowledge/schema";

const contentDirectory = path.resolve("content");
const outputFile = path.resolve("generated", "knowledge-chunks.json");

type MarkdownSection = {
  heading: string;
  text: string;
};

/**
 * Find every Markdown source inside content/ and its subfolders.
 */
async function findMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

/**
 * Convert Markdown sections beginning with ## into separate pieces.
 *
 * Text before the first ## heading is ignored because it normally contains
 * the repeated document title.
 */
function splitMarkdownSections(markdown: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];

  let currentHeading: string | undefined;
  let currentLines: string[] = [];

  const saveCurrentSection = (): void => {
    if (!currentHeading) {
      return;
    }

    const text = currentLines.join("\n").trim();

    if (text.length > 0) {
      sections.push({
        heading: currentHeading,
        text,
      });
    }
  };

  for (const line of markdown.split(/\r?\n/)) {
    const headingMatch = line.match(/^##\s+(.+?)\s*$/);

    if (headingMatch) {
      saveCurrentSection();
      currentHeading = headingMatch[1].trim();
      currentLines = [];
      continue;
    }

    if (currentHeading) {
      currentLines.push(line);
    }
  }

  saveCurrentSection();

  return sections;
}

/**
 * Convert a heading into a stable ID-friendly value.
 *
 * Example:
 * "My Contribution" → "my-contribution"
 */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createLinks(metadata: SourceMetadata) {
  return {
    paper: metadata.paper_url,
    repository: metadata.repository_url,
    portfolio: metadata.portfolio_url,
    liveDemo: metadata.live_demo_url,
  };
}

/**
 * Read and transform one knowledge-source document.
 */
async function ingestSourceFile(filePath: string): Promise<KnowledgeChunk[]> {
  const rawFile = await readFile(filePath, "utf8");

  const parsedDocument = matter(rawFile);

  const metadata = sourceMetadataSchema.parse(parsedDocument.data);
  const sections = splitMarkdownSections(parsedDocument.content);

  if (sections.length === 0) {
    throw new Error(
      `No level-two Markdown sections were found in ${filePath}. ` +
        `Add headings such as "## Overview".`,
    );
  }

  return sections.map((section) =>
    knowledgeChunkSchema.parse({
      id: `${metadata.id}--${slugify(section.heading)}--001`,

      sourceId: metadata.id,
      sourceType: metadata.source_type,

      title: metadata.title,
      section: section.heading,
      language: metadata.language,

      text: section.text,

      lastVerified: metadata.last_verified,

      links: createLinks(metadata),
    }),
  );
}

async function main(): Promise<void> {
  const sourceFiles = await findMarkdownFiles(contentDirectory);

  if (sourceFiles.length === 0) {
    throw new Error("No Markdown knowledge sources were found in content/.");
  }

  const chunks: KnowledgeChunk[] = [];

  for (const sourceFile of sourceFiles) {
    const sourceChunks = await ingestSourceFile(sourceFile);
    chunks.push(...sourceChunks);

    console.log(
      `Processed ${path.relative(process.cwd(), sourceFile)}: ` +
        `${sourceChunks.length} chunk(s)`,
    );
  }

  await mkdir(path.dirname(outputFile), { recursive: true });

  await writeFile(
    outputFile,
    `${JSON.stringify(chunks, null, 2)}\n`,
    "utf8",
  );

  console.log("");
  console.log(`Sources processed: ${sourceFiles.length}`);
  console.log(`Chunks generated: ${chunks.length}`);
  console.log(`Output: ${path.relative(process.cwd(), outputFile)}`);
}

main().catch((error: unknown) => {
  console.error("Knowledge ingestion failed.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});