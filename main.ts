// gta6-clipper-01 — "Awakens ID" GTA 6 clip entry.
// The entry's program: it copies VIDEO.json (the YouTube Short's address)
// from the repository root to the output directory, where the house reads it.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(repoRoot, "VIDEO.json");

const video = JSON.parse(readFileSync(source, "utf8")) as { url?: unknown };
if (typeof video.url !== "string" || !video.url.startsWith("https://")) {
  throw new Error("VIDEO.json must hold a https YouTube url");
}
// The house only accepts a YouTube address (shorts, watch or youtu.be).
const youtube = /^https:\/\/(www\.|m\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)/;
if (!youtube.test(video.url)) {
  throw new Error(`VIDEO.json url is not a YouTube address: ${video.url}`);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, "VIDEO.json"));
console.log(`copied VIDEO.json -> ${join(outputDir, "VIDEO.json")} (${video.url})`);
