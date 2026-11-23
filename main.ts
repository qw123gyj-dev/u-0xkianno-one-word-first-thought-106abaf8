// One Word, First Thought — entry writer (program/v1, Node 22, stdlib only).
// Writes the one-word entry to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output/entry.txt), then reads it back and verifies the bytes match.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "petrichor";

const MIN_CHARS = 1;
const MAX_CHARS = 24;

function main(): void {
  // Gate: UTF-8 text of 1 to 24 characters, not only white space.
  if (WORD.length < MIN_CHARS || WORD.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS} to ${MAX_CHARS} characters, got ${WORD.length}`,
    );
  }
  if (WORD.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }

  // Exactly one word: no white space, no punctuation, letters only.
  if (/\s/.test(WORD)) {
    throw new Error(`entry must be exactly one word, got whitespace in ${JSON.stringify(WORD)}`);
  }
  if (!/^[A-Za-z]+$/.test(WORD)) {
    throw new Error(
      `entry must be a single word of letters only, got ${JSON.stringify(WORD)}`,
    );
  }
  const words = WORD.trim().split(/\s+/);
  if (words.length !== 1) {
    throw new Error(`entry must be exactly one word, got ${words.length}`);
  }
  console.log(`entry: ${WORD}`);
  console.log(`entry length: ${WORD.length} characters, ${words.length} word`);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, WORD, "utf8");

  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== WORD) {
    throw new Error(`verification failed: ${outPath} does not match the entry`);
  }
  console.log(`wrote ${outPath} (${WORD.length} characters, verified)`);
}

main();
