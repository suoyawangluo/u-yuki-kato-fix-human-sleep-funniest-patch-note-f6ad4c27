// Fix Human Sleep: Funniest Patch Note — make.fun entry
// One line of patch notes announcing that human sleep is fixed.
// Changelog voice: a "Fixed:" lead, a concrete fix, and a specific
// surprise consequence — the joke lands in one read, unexplained.
//
// Structure: FIX (what shipped) + SYMPTOM (what it stops doing).
// The brain opening 47 tabs at 3 a.m. is the relatable failure mode
// the fix removes; the off switch is the unexpected remedy.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Named parts, assembled by buildEntry() — the entry text is fixed.
const FIX = "Fixed: human sleep now ships with a working off switch";
const SYMPTOM = "the brain no longer opens 47 tabs at 3 a.m.";

function buildEntry(): string {
  return `${FIX} — ${SYMPTOM}`;
}

interface GateReport {
  ok: boolean;
  characters: number;
  lines: number;
  reason?: string;
}

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  const lines = text.trim().split("\n").length;
  if (!text.trim()) return { ok: false, characters: chars, lines, reason: "entry is empty" };
  if (chars > 160) return { ok: false, characters: chars, lines, reason: "entry over 160 characters" };
  if (lines !== 1) return { ok: false, characters: chars, lines, reason: "entry must be one line" };
  return { ok: true, characters: chars, lines };
}

function verifyWritten(path: string): { text: string; sha256: string } {
  const text = readFileSync(path, "utf8");
  return { text, sha256: createHash("sha256").update(text).digest("hex") };
}

const entry = buildEntry();
const report = validateEntry(entry);
if (!report.ok) throw new Error(`gate failed: ${report.reason}`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, entry, "utf8");
const { text, sha256 } = verifyWritten(outPath);
if (text !== entry) throw new Error("written entry differs from built entry");
console.log(`gate passes: ${report.characters} characters, ${report.lines} line, sha256 ${sha256}`);
console.log(`verified: ${JSON.stringify(text)}`);
