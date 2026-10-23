// Looks up how each word on the Dale-Chall list (about 3,000 words most 4th
// graders know) is pronounced, using the CMU Pronouncing Dictionary. This is the
// starting point for building sound packs: a pack is the words whose
// pronunciation has the sound in the right place.
//
// Run: bun run pronunciations
// Writes .word-data/pronunciations.json: { "rabbit": [["R", "AE1", "B", "AH0", "T"]], ... }
// Phonemes are ARPAbet; vowels end in a stress digit (1 primary, 2 secondary, 0 none).
// Some words have more than one pronunciation, e.g. "read" (R EH1 D and R IY1 D).
//
// Both lists are downloaded into .word-data/ (not committed) the first time.
// The CMU dictionary is BSD-licensed; the Dale-Chall list is the copy shipped
// with the MIT-licensed textstat library.
import { existsSync } from "node:fs";
import path from "node:path";

const DATA = path.resolve(import.meta.dirname, "../.word-data");
const SOURCES = {
  "dale-chall.txt":
    "https://raw.githubusercontent.com/textstat/textstat/30303f95031f5e29f2811ea1bd4126f76cb828a1/textstat/resources/en/easy_words.txt",
  "cmudict.dict":
    "https://raw.githubusercontent.com/cmusphinx/cmudict/74790861f652b15e4ac49015a90074ad62a27690/cmudict.dict",
};

export type Pronunciation = string[];

async function download(name: keyof typeof SOURCES): Promise<string> {
  const file = path.join(DATA, name);
  if (!existsSync(file)) {
    const response = await fetch(SOURCES[name]);
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    await Bun.write(file, response);
  }
  return Bun.file(file).text();
}

/** Every pronunciation in the CMU dictionary, keyed by lowercase word. */
async function loadCmudict(): Promise<Map<string, Pronunciation[]>> {
  const dictionary = new Map<string, Pronunciation[]>();
  for (const line of (await download("cmudict.dict")).split("\n")) {
    // e.g. "read(2) R IY1 D" or "aalborg AO1 L B AO0 R G # place, danish"
    const [entry, ...phonemes] = line.split("#")[0].trim().split(/\s+/);
    if (!entry || phonemes.length === 0) continue;
    const word = entry.replace(/\(\d+\)$/, "");
    dictionary.set(word, [...(dictionary.get(word) ?? []), phonemes]);
  }
  return dictionary;
}

/**
 * Words the dictionary doesn't have are usually compounds ("toadstool",
 * "flip-flop"), so they're pronounced as their two halves joined together.
 */
function compound(
  word: string,
  dictionary: Map<string, Pronunciation[]>,
): Pronunciation[] | undefined {
  const [first, second] = word.split("-");
  if (second !== undefined) {
    const a = dictionary.get(first)?.[0];
    const b = dictionary.get(second)?.[0];
    return a && b ? [[...a, ...b]] : undefined;
  }
  // Prefer the shortest first half, so "toadstool" is toad + stool, not toads + tool.
  for (let split = 3; split <= word.length - 3; split++) {
    const a = dictionary.get(word.slice(0, split))?.[0];
    const b = dictionary.get(word.slice(split))?.[0];
    if (a && b) return [[...a, ...b]];
  }
}

/**
 * Every Dale-Chall word and its pronunciations, plus the words not found.
 * `extra` adds words that aren't on the list, such as "zoo".
 */
export async function loadPronunciations(extra: string[] = []): Promise<{
  words: Map<string, Pronunciation[]>;
  missing: string[];
}> {
  const dictionary = await loadCmudict();
  const words = new Map<string, Pronunciation[]>();
  const missing: string[] = [];
  const list = (await download("dale-chall.txt")).split("\n");
  for (const line of [...list, ...extra]) {
    const word = line.trim().toLowerCase();
    if (!word) continue;
    const pronunciations = dictionary.get(word) ?? compound(word, dictionary);
    if (pronunciations) words.set(word, pronunciations);
    else missing.push(word);
  }
  return { words, missing };
}

if (import.meta.main) {
  const { words, missing } = await loadPronunciations();
  const output = path.join(DATA, "pronunciations.json");
  await Bun.write(output, JSON.stringify(Object.fromEntries(words), null, 1));
  console.log(`${words.size} words written to ${path.relative(".", output)}.`);
  if (missing.length > 0) {
    console.log(`Not in the CMU dictionary: ${missing.join(", ")}`);
  }
}
