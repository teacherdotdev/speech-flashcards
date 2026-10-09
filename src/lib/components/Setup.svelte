<script lang="ts">
  import { PACKS, cardsFor } from "#lib/packs/index.ts";
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

  function togglePosition(position: Position) {
    positions = positions.includes(position)
      ? positions.filter((p) => p !== position)
      : POSITIONS.filter((p) => p === position || positions.includes(p));
  }
</script>

<main class="mx-auto flex min-h-screen-safe max-w-3xl flex-col gap-8 px-4 py-8">
  <h1 class="text-3xl font-bold text-accent-dark">Speech Flashcards</h1>

  <section class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold text-slate-700">Sound</h2>
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

  <section class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold text-slate-700">
      Where is the sound? <span class="font-normal text-slate-500"
        >Pick one or more.</span
      >
    </h2>
    <div class="grid gap-3 sm:grid-cols-3">
      {#each POSITIONS as position (position)}
        {@const selected = positions.includes(position)}
        {@const count = pack.cards[position]?.length ?? 0}
        <button
          type="button"
          aria-pressed={selected}
          disabled={count === 0}
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
            >{POSITION_LABELS[position].hint} · {count} words</span
          >
        </button>
      {/each}
    </div>
  </section>

  <button
    type="button"
    disabled={cardCount === 0}
    onclick={() => onStart({ packId, positions })}
    class="self-start rounded-2xl bg-accent px-8 py-4 text-2xl font-bold text-white shadow-sm transition-colors hover:bg-accent-dark disabled:bg-slate-300"
  >
    {cardCount === 0 ? "Pick a position" : `Start · ${cardCount} cards`}
  </button>

  <footer class="mt-auto pt-8">
    <Attribution />
  </footer>
</main>
