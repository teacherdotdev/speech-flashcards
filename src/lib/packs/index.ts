import type { Card, PictogramId, Position, SoundPack } from "#lib/types.ts";
import { r } from "./r.ts";
import { vocalicR } from "./vocalic-r.ts";
import { s } from "./s.ts";
import { l } from "./l.ts";
import { thVoiceless } from "./th-voiceless.ts";
import { sBlends } from "./s-blends.ts";
import { rBlends } from "./r-blends.ts";
import { lBlends } from "./l-blends.ts";
import { k } from "./k.ts";
import { sh } from "./sh.ts";
import { ch } from "./ch.ts";
import { j } from "./j.ts";
import { z } from "./z.ts";
import { g } from "./g.ts";
import { f } from "./f.ts";
import { v } from "./v.ts";
import { thVoiced } from "./th-voiced.ts";
import { t } from "./t.ts";
import { d } from "./d.ts";
import { ng } from "./ng.ts";

/** Every sound pack, in the order shown to the teacher. Add new packs here. */
export const PACKS: SoundPack[] = [
  r,
  vocalicR,
  s,
  l,
  thVoiceless,
  sBlends,
  rBlends,
  lBlends,
  k,
  sh,
  ch,
  j,
  z,
  g,
  f,
  v,
  thVoiced,
  t,
  d,
  ng,
];

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
