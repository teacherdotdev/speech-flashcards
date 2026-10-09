import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import path from "node:path";
import { PACKS } from "./index.ts";

const folder = path.resolve(import.meta.dirname, "../pictograms");

describe("sound packs", () => {
  test("every card's picture is saved in the app (run: bun run pictograms)", () => {
    const missing = PACKS.flatMap((pack) =>
      Object.values(pack.cards).flatMap((cards) =>
        cards
          .filter((c) => !existsSync(path.join(folder, `${c.pictogram}.png`)))
          .map((c) => `${pack.id}: ${c.word} (${c.pictogram})`),
      ),
    );
    expect(missing).toEqual([]);
  });

  test("pack ids are unique", () => {
    const ids = PACKS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
