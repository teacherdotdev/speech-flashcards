/** How many other cards must be shown before the same card can come back. */
export const MIN_GAP = 3;

/**
 * An endless shuffled deck. Each pass shows every card once in a random
 * order, and a card never returns until MIN_GAP other cards have been shown,
 * even where one pass ends and the next begins.
 */
export function createDeck<T>(
  cards: readonly T[],
  random: () => number = Math.random,
): () => T {
  if (cards.length === 0) throw new Error("A deck needs at least one card");
  const gap = Math.min(MIN_GAP, cards.length - 1);
  let leftInPass: T[] = [];
  const recent: T[] = [];

  return function next() {
    if (leftInPass.length === 0) leftInPass = [...cards];
    // Never empty: the cards in `recent` that are still left in this pass all
    // came from the end of the previous pass, and there are at most `gap` of them.
    const allowed = leftInPass.filter((card) => !recent.includes(card));
    const card = allowed[Math.floor(random() * allowed.length)];
    leftInPass.splice(leftInPass.indexOf(card), 1);
    recent.push(card);
    if (recent.length > gap) recent.shift();
    return card;
  };
}
