// Saves the ARASAAC picture for every card in every pack into src/lib/pictograms/,
// so the app never has to fetch pictures from ARASAAC while a student is practicing.
// Run after adding or changing words: bun run pictograms
import { existsSync } from "node:fs";
import path from "node:path";
import { PACKS, pictogramIds } from "#lib/packs/index.ts";

const folder = path.resolve(import.meta.dirname, "../src/lib/pictograms");
// Custom pictures ("custom/...") are drawn by us, so only ARASAAC ids are downloaded.
const ids = new Set(
  PACKS.flatMap(pictogramIds).filter((id) => typeof id === "number"),
);

let downloaded = 0;
for (const id of ids) {
  const file = path.join(folder, `${id}.png`);
  if (existsSync(file)) continue;
  const response = await fetch(
    `https://static.arasaac.org/pictograms/${id}/${id}_500.png`,
  );
  if (!response.ok) throw new Error(`Pictogram ${id}: HTTP ${response.status}`);
  await Bun.write(file, response);
  downloaded += 1;
}
console.log(
  `${downloaded} downloaded, ${ids.size - downloaded} already saved.`,
);
