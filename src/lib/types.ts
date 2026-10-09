/** Where the target sound falls in the word. */
export const POSITIONS = ["initial", "medial", "final"] as const;
export type Position = (typeof POSITIONS)[number];

export const POSITION_LABELS: Record<Position, { name: string; hint: string }> =
  {
    initial: { name: "Initial", hint: "beginning of the word" },
    medial: { name: "Medial", hint: "middle of the word" },
    final: { name: "Final", hint: "end of the word" },
  };

export interface Card {
  word: string;
  /** ARASAAC pictogram id; its picture is saved as src/lib/pictograms/{id}.png. */
  pictogram: number;
}

export interface SoundPack {
  /** Short, stable id saved in the teacher's settings, e.g. "r". */
  id: string;
  /** What the teacher sees, e.g. "R". */
  name: string;
  /** Leave a position out if this sound has no words for it. */
  cards: Partial<Record<Position, Card[]>>;
}
