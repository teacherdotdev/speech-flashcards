import type { Card, PictogramId, Position, SoundPack } from "#lib/types.ts";
import { r } from "./r.ts";

/** Every sound pack, in the order shown to the teacher. Add new packs here. */
export const PACKS: SoundPack[] = [r];

export function cardsFor(pack: SoundPack, positions: Position[]): Card[] {
  return positions.flatMap((position) => pack.cards[position] ?? []);
}

/** Every picture a pack uses, each listed once. */
export function pictogramIds(pack: SoundPack): PictogramId[] {
  const all = Object.values(pack.cards).flatMap((cards) =>
    cards.map((card) => card.pictogram),
  );
  return [...new Set(all)];
}
