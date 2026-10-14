// Saves the ARASAAC picture for every card in every pack into src/lib/pictograms/,
// so the app never has to fetch pictures from ARASAAC while a student is practicing.
// Pictograms listed in pictogram-looks.ts are saved with their people recolored.
// Run after adding or changing words: bun run pictograms
import { existsSync } from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { PACKS, pictogramIds } from "#lib/packs/index.ts";
import { LOOKS, SKIN_TONES, type Look } from "./pictogram-looks.ts";

const folder = path.resolve(import.meta.dirname, "../src/lib/pictograms");
// Custom pictures ("custom/...") are drawn by us, so only ARASAAC ids are downloaded.
const ids = new Set(
  PACKS.flatMap(pictogramIds).filter((id) => typeof id === "number"),
);

async function download(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

/** ARASAAC's renderer, which draws a pictogram's people in its own skin and hair colors. */
function rendererUrl(id: number, skin: string, hair?: string): string {
  const params = new URLSearchParams({ skin });
  if (hair) params.set("hair", hair);
  return `https://api.arasaac.org/v1/pictograms/${id}?${params}`;
}

type Rgb = [number, number, number];

function rgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// ARASAAC recolors a pictogram by swapping its skin color, so its light and dark
// renders differ only in the skin, including the shading and the anti-aliased edges
// where skin meets an outline. Each of those pixels is a blend that is linear in the
// skin color, so per channel
//   new = light + (dark − light) × (target − lightSkin) / (darkSkin − lightSkin)
// repaints the skin in a tone the renderer can't draw and leaves every other pixel.
async function paint(id: number, target: string, hair?: string) {
  const [light, dark] = await Promise.all(
    [SKIN_TONES.light.api, SKIN_TONES.dark.api].map(async (skin) =>
      PNG.sync.read(await download(rendererUrl(id, skin, hair))),
    ),
  );
  const from = rgb(SKIN_TONES.light.hex);
  const to = rgb(SKIN_TONES.dark.hex);
  const scale = rgb(target).map((t, c) => (t - from[c]) / (to[c] - from[c]));
  for (let i = 0; i < light.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const diff = dark.data[i + c] - light.data[i + c];
      if (diff !== 0) {
        const value = Math.round(light.data[i + c] + diff * scale[c]);
        light.data[i + c] = Math.min(255, Math.max(0, value));
      }
    }
  }
  return PNG.sync.write(light);
}

function picture(id: number, look: Look | undefined) {
  if (!look) {
    return download(
      `https://static.arasaac.org/pictograms/${id}/${id}_500.png`,
    );
  }
  const skin = SKIN_TONES[look.skin ?? "light"];
  return "api" in skin
    ? download(rendererUrl(id, skin.api, look.hair))
    : paint(id, skin.hex, look.hair);
}

let downloaded = 0;
for (const id of ids) {
  const file = path.join(folder, `${id}.png`);
  if (existsSync(file)) continue;
  await Bun.write(file, await picture(id, LOOKS[id]));
  downloaded += 1;
}
console.log(
  `${downloaded} downloaded, ${ids.size - downloaded} already saved.`,
);
