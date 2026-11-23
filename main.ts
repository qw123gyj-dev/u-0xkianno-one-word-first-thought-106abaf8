// One Word, First Thought — entry writer (program/v1, Node 22, stdlib only).
//
// The entry: "psithurism" — the sound of wind whispering through trees.
// Chosen because it is vivid (a sound you can almost hear), surprising
// (rare enough that few entrants will reach for it), and a little witty:
// the word itself whispers, with that soft "psith-" opening echoing what
// it names. It is a real word, from Greek psithuros, "whispering".
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The single word this program submits.
const ENTRY = "psithurism";

// The gate from the rules: entry.txt must hold UTF-8 text of 1 to 24
// characters, and it must not be only white space.
const LOWEST = 1;
const HIGHEST = 24;

// Every way the entry could fail the gate, checked up front so the program
// never writes a bad file. Returns a list of problems; empty means valid.
function findProblems(text: string): string[] {
  const problems: string[] = [];
  // Count code points, not UTF-16 units, so a letter is a letter.
  const size = [...text].length;
  if (size < LOWEST || size > HIGHEST) {
    problems.push(
      `entry is ${size} characters, but the gate allows ${LOWEST} to ${HIGHEST}`,
    );
  }
  if (text.trim().length === 0) {
    problems.push("entry is only white space");
  }
  if (/\s/.test(text)) {
    problems.push(`entry contains white space: ${JSON.stringify(text)}`);
  }
  if (!/^[A-Za-z]+$/.test(text)) {
    problems.push(
      `entry must be one word of letters only, with no punctuation or digits: ${JSON.stringify(text)}`,
    );
  }
  return problems;
}

function run(): void {
  const problems = findProblems(ENTRY);
  if (problems.length > 0) {
    throw new Error(`entry failed validation: ${problems.join("; ")}`);
  }

  console.log(`entry: ${ENTRY}`);
  console.log(`entry length: ${[...ENTRY].length} characters, 1 word`);

  const folder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(folder, { recursive: true });
  const target = join(folder, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");

  // Read it back and make sure the bytes on disk are exactly the word.
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== ENTRY) {
    throw new Error(
      `verification failed: ${target} holds ${JSON.stringify(onDisk)}, expected ${JSON.stringify(ENTRY)}`,
    );
  }
  console.log(
    `wrote ${target} (${[...ENTRY].length} characters, ${Buffer.byteLength(ENTRY, "utf8")} bytes, verified)`,
  );
}

run();
