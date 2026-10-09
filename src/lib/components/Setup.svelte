<script lang="ts">
  import { resolve } from "$app/paths";
  import { PACKS, cardsFor } from "#lib/packs/index.ts";
  import { pictogramUrl } from "#lib/pictograms.ts";
  import type { Settings } from "#lib/settings.ts";
  import { POSITIONS, POSITION_LABELS, type Position } from "#lib/types.ts";
  import Attribution from "./Attribution.svelte";

  let {
    initial,
    onStart,
  }: { initial: Settings; onStart: (settings: Settings) => void } = $props();

  // Svelte warns about capturing a prop's first value; that's what we want here.
  // svelte-ignore state_referenced_locally
  let packId = $state(initial.packId);
  // svelte-ignore state_referenced_locally
  let positions = $state<Position[]>([...initial.positions]);

  let pack = $derived(PACKS.find((p) => p.id === packId) ?? PACKS[0]);
  let cardCount = $derived(cardsFor(pack, positions).length);
  // One card from each position, fanned out beside the title as a preview of the pack.
  let previewCards = $derived(
    POSITIONS.flatMap((position) => pack.cards[position]?.slice(0, 1) ?? []),
  );

  function togglePosition(position: Position) {
    positions = positions.includes(position)
      ? positions.filter((p) => p !== position)
      : POSITIONS.filter((p) => p === position || positions.includes(p));
  }

  const fan = [
    "-rotate-6 translate-y-2",
    "z-10 -mx-4",
    "rotate-6 translate-y-2",
  ];
  const key =
    "rounded-md bg-white px-1.5 py-0.5 font-sans font-semibold text-slate-700 ring-1 ring-slate-300";
  const step =
    "flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold text-white";
</script>

<main
  class="mx-auto flex min-h-screen-safe max-w-3xl flex-col gap-8 px-4 pt-10 pb-6"
>
  <header class="flex items-center justify-between gap-6">
    <div class="flex min-w-0 flex-1 flex-col gap-3">
      <h1 class="text-4xl font-bold text-accent-dark">Speech Flashcards</h1>
      <p class="max-w-md text-lg leading-snug text-slate-600">
        Picture cards for speech sound practice. Pick a sound, choose where it
        falls in the word, and tap through a fresh deck every time.
      </p>
    </div>
    <div class="hidden shrink-0 items-start pr-4 sm:flex" aria-hidden="true">
      {#each previewCards as card, i (card.word)}
        <div
          class="flex w-26 flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-md ring-1 ring-slate-200 {fan[
            i
          ]}"
        >
          <img
            src={pictogramUrl(card.pictogram)}
            alt=""
            class="aspect-square w-full object-contain"
            draggable="false"
          />
          <span class="font-bold text-slate-800">{card.word}</span>
        </div>
      {/each}
    </div>
  </header>

  <section
    class="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:p-6"
  >
    <h2 class="flex items-center gap-3 text-xl font-bold text-slate-800">
      <span class={step} aria-hidden="true">1</span>
      Pick a sound
    </h2>
    <div class="flex flex-wrap gap-3">
      {#each PACKS as option (option.id)}
        <button
          type="button"
          aria-pressed={option.id === packId}
          onclick={() => (packId = option.id)}
          class="min-w-20 rounded-2xl border-2 px-5 py-3 text-2xl font-bold transition-colors
            {option.id === packId
            ? 'border-accent bg-accent text-white'
            : 'border-slate-300 bg-white text-slate-700 hover:border-accent'}"
        >
          {option.name}
        </button>
      {/each}
    </div>
  </section>

  <section
    class="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:p-6"
  >
    <h2
      class="flex flex-wrap items-center gap-x-3 text-xl font-bold text-slate-800"
    >
      <span class={step} aria-hidden="true">2</span>
      Where is the sound?
      <span class="text-base font-normal text-slate-500">Pick one or more.</span
      >
    </h2>
    <div class="grid gap-3 sm:grid-cols-3">
      {#each POSITIONS as position (position)}
        {@const selected = positions.includes(position)}
        {@const words = pack.cards[position] ?? []}
        <button
          type="button"
          aria-pressed={selected}
          disabled={words.length === 0}
          onclick={() => togglePosition(position)}
          class="flex flex-col items-start gap-1 rounded-2xl border-2 px-5 py-4 text-left transition-colors disabled:opacity-40
            {selected
            ? 'border-accent bg-accent-soft'
            : 'border-slate-300 bg-white hover:border-accent'}"
        >
          <span class="flex w-full items-center justify-between gap-2">
            <span class="text-xl font-bold"
              >{POSITION_LABELS[position].name}</span
            >
            <span
              aria-hidden="true"
              class="flex size-7 items-center justify-center rounded-md border-2 text-lg leading-none
                {selected
                ? 'border-accent bg-accent text-white'
                : 'border-slate-300 bg-white'}">{selected ? "✓" : ""}</span
            >
          </span>
          <span class="text-sm text-slate-600"
            >{POSITION_LABELS[position].hint} · {words.length} words</span
          >
          {#if words.length > 0}
            <span class="text-sm font-semibold text-slate-500 italic"
              >{words
                .slice(0, 3)
                .map((card) => card.word)
                .join(", ")}…</span
            >
          {/if}
        </button>
      {/each}
    </div>
  </section>

  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
    <button
      type="button"
      disabled={cardCount === 0}
      onclick={() => onStart({ packId, positions })}
      class="shrink-0 rounded-2xl bg-accent px-8 py-4 text-2xl font-bold text-white shadow-sm transition-colors hover:bg-accent-dark disabled:bg-slate-300"
    >
      {cardCount === 0 ? "Pick a position" : `Start · ${cardCount} cards`}
    </button>
    <p class="text-sm leading-snug text-slate-600">
      Cards shuffle endlessly and a word never comes right back. Tap the card or
      press <kbd class={key}>→</kbd> for the next one,
      <kbd class={key}>←</kbd> to go back, and
      <kbd class={key}>Esc</kbd> to return here.
    </p>
  </div>

  <footer
    class="mt-auto flex flex-col items-center gap-3 pt-8 text-center text-sm text-slate-600"
  >
    <p
      class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-semibold"
    >
      <a
        href="https://teacher.dev"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 hover:underline"
      >
        <img src="/teacher-dev-logo.svg" alt="" width="20" height="20" />
        Built by teacher.dev
      </a>
      <a href={resolve("/about")} class="hover:underline">About</a>
      <a href={resolve("/privacy")} class="hover:underline">Privacy</a>
    </p>
    <Attribution />
  </footer>
</main>
