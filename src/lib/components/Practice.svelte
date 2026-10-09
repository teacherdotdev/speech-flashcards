<script lang="ts">
  import { createDeck } from "#lib/deck.ts";
  import { cardsFor } from "#lib/packs/index.ts";
  import { pictogramUrl } from "#lib/pictograms.ts";
  import {
    POSITION_LABELS,
    type Position,
    type SoundPack,
  } from "#lib/types.ts";

  let {
    pack,
    positions,
    onExit,
  }: { pack: SoundPack; positions: Position[]; onExit: () => void } = $props();

  // A practice session keeps the pack and positions it started with.
  // svelte-ignore state_referenced_locally
  const cards = cardsFor(pack, positions);
  const nextCard = createDeck(cards);

  // Everything shown so far, so "Back" can step to earlier cards.
  let history = $state([nextCard()]);
  let index = $state(0);
  let card = $derived(history[index]);

  function next() {
    if (index === history.length - 1) history.push(nextCard());
    index += 1;
  }

  function back() {
    if (index > 0) index -= 1;
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "ArrowRight" || event.key === " ") next();
    else if (event.key === "ArrowLeft") back();
    else if (event.key === "Escape") onExit();
    else return;
    event.preventDefault();
  }
</script>

<svelte:window {onkeydown} />

<main class="flex h-screen-safe flex-col gap-3 p-3 sm:gap-4 sm:p-4">
  <header class="flex items-center justify-between gap-3">
    <button
      type="button"
      onclick={onExit}
      class="rounded-xl bg-white px-4 py-2 text-lg font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
    >
      ← Change sounds
    </button>
    <p class="text-right text-slate-600">
      <span class="font-bold text-accent-dark">{pack.name}</span>
      · {positions.map((p) => POSITION_LABELS[p].name).join(", ")}
      · card {index + 1}
    </p>
  </header>

  <button
    type="button"
    onclick={next}
    aria-label="{card.word}. Tap for the next card."
    class="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 rounded-3xl bg-white p-6 shadow-md"
  >
    <img
      src={pictogramUrl(card.pictogram)}
      alt=""
      class="min-h-0 w-full max-w-lg flex-1 object-contain"
      draggable="false"
    />
    <span class="text-6xl font-bold text-slate-900 sm:text-8xl"
      >{card.word}</span
    >
  </button>

  <nav class="flex justify-between gap-3">
    <button
      type="button"
      onclick={back}
      disabled={index === 0}
      class="rounded-2xl bg-white px-6 py-4 text-xl font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40"
    >
      ← Back
    </button>
    <button
      type="button"
      onclick={next}
      class="rounded-2xl bg-accent px-10 py-4 text-xl font-bold text-white shadow-sm hover:bg-accent-dark"
    >
      Next →
    </button>
  </nav>
</main>
