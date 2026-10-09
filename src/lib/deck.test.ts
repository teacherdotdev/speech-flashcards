import { describe, expect, test } from "bun:test";
import { createDeck, MIN_GAP } from "./deck.ts";

function draw(size: number, count: number): number[] {
  const cards = Array.from({ length: size }, (_, i) => i);
  const next = createDeck(cards);
  return Array.from({ length: count }, next);
}

describe("createDeck", () => {
  test("each pass shows every card exactly once", () => {
    for (const size of [1, 2, 5, 10, 30]) {
      const shown = draw(size, size * 50);
      for (let start = 0; start < shown.length; start += size) {
        const pass = shown.slice(start, start + size).sort((a, b) => a - b);
        expect(pass).toEqual([...Array(size).keys()]);
      }
    }
  });

  test(`a card waits for ${MIN_GAP} others before repeating`, () => {
    for (const size of [4, 5, 10, 30]) {
      for (let run = 0; run < 200; run++) {
        const shown = draw(size, size * 5);
        shown.forEach((card, i) => {
          expect(shown.slice(Math.max(0, i - MIN_GAP), i)).not.toContain(card);
        });
      }
    }
  });

  test("small decks still never repeat back to back", () => {
    for (const size of [2, 3]) {
      const shown = draw(size, 300);
      shown.slice(1).forEach((card, i) => {
        expect(
          shown.slice(Math.max(0, i + 1 - (size - 1)), i + 1),
        ).not.toContain(card);
      });
    }
  });
});
