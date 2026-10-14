<script lang="ts">
  import InfoPage from "#lib/components/InfoPage.svelte";
  import { PACKS } from "#lib/packs/index.ts";
  import { pictogramUrl } from "#lib/pictograms.ts";
  import { onMount } from "svelte";
  import { DEFAULT_SETTINGS, loadSettings } from "#lib/settings.ts";
  import { POSITIONS, POSITION_LABELS } from "#lib/types.ts";

  // Prerendered with the first pack; once loaded, switch to the sound the
  // teacher last practiced, which only their device knows.
  let packId = $state(DEFAULT_SETTINGS.packId);
  onMount(() => (packId = loadSettings().packId));
  let showPictures = $state(false);
  let dialog = $state<HTMLDialogElement>();

  let pack = $derived(PACKS.find((p) => p.id === packId) ?? PACKS[0]);
  let columns = $derived(
    POSITIONS.map((position) => pack.cards[position] ?? []),
  );
  let rows = $derived(Math.max(...columns.map((cards) => cards.length)));
  let wordCount = $derived(
    columns.reduce((sum, cards) => sum + cards.length, 0),
  );

  let mailto = $derived.by(() => {
    const subject = `Speech Flashcards: changes to the ${pack.name} pack`;
    const body = [
      `Pack: ${pack.name}`,
      "",
      "Words to remove:",
      "",
      "Words to add (and whether the sound is at the beginning, middle or end):",
      "",
      "Pictures to change:",
      "",
    ].join("\n");
    return `mailto:support@teacher.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const card = "rounded-2xl bg-white p-5 shadow-sm";
</script>

<InfoPage
  path="/packs"
  description="Every word in all 20 speech sound packs, sorted by initial, medial and final position, with a picture for each word."
  title="Flashcard packs"
  lede="Every word in every sound pack, sorted by where the sound falls in the word."
>
  <section class={card} aria-labelledby="sound-title">
    <h2 id="sound-title" class="text-lg font-bold">Pick a sound</h2>
    <div class="mt-3 flex flex-wrap gap-2">
      {#each PACKS as option (option.id)}
        <button
          type="button"
          aria-pressed={option.id === packId}
          onclick={() => (packId = option.id)}
          class="min-w-12 rounded-xl border-2 px-3 py-1.5 font-bold transition-colors
            {option.id === packId
            ? 'border-accent bg-accent text-white'
            : 'border-slate-300 bg-white text-slate-700 hover:border-accent'}"
        >
          {option.name}
        </button>
      {/each}
    </div>
  </section>

  <section class={card} aria-labelledby="words-title">
    <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <h2 id="words-title" class="text-lg font-bold">
        {pack.name}
        <span class="font-normal text-slate-500">· {wordCount} words</span>
      </h2>
      <div class="flex items-center gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={showPictures}
          onclick={() => (showPictures = !showPictures)}
          class="inline-flex min-h-11 items-center gap-2 font-semibold text-slate-700"
        >
          <span
            aria-hidden="true"
            class="flex h-6 w-10 items-center rounded-full p-0.5 transition-colors
              {showPictures ? 'bg-accent' : 'bg-slate-300'}"
          >
            <span
              class="size-5 rounded-full bg-white shadow-sm transition-transform
                {showPictures ? 'translate-x-4' : ''}"
            ></span>
          </span>
          Pictures
        </button>
        <button
          type="button"
          onclick={() => dialog?.showModal()}
          class="min-h-11 text-sm font-semibold text-accent-dark underline underline-offset-2"
        >
          Request changes
        </button>
      </div>
    </div>

    <table class="mt-4 w-full table-fixed border-collapse text-left">
      <thead>
        <tr class="border-b-2 border-slate-200">
          {#each POSITIONS as position, i (position)}
            <th scope="col" class="px-2 pb-2 align-bottom">
              <span class="block font-bold text-slate-800"
                >{POSITION_LABELS[position].name}</span
              >
              <span class="block text-sm font-normal text-slate-500"
                >{columns[i].length} words</span
              >
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each { length: rows }, row (row)}
          <tr class="border-b border-slate-100 last:border-0">
            {#each columns as cards, i (POSITIONS[i])}
              {@const c = cards[row]}
              <td class="px-2 py-1.5 align-top break-words text-slate-800">
                {#if c}
                  {#if showPictures}
                    <img
                      src={pictogramUrl(c.pictogram)}
                      alt=""
                      loading="lazy"
                      class="mb-1 aspect-square w-full max-w-24 object-contain"
                      draggable="false"
                    />
                  {/if}
                  {c.word}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    {#if columns.some((cards) => cards.length === 0)}
      <p class="mt-3 text-sm text-slate-500">
        Empty columns: no everyday words have this sound in that position.
      </p>
    {/if}
  </section>
</InfoPage>

<dialog
  bind:this={dialog}
  aria-labelledby="request-title"
  onclick={(event) => event.target === dialog && dialog.close()}
  class="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-white shadow-xl backdrop:bg-slate-900/40"
>
  <!-- Padding lives in here, so a click on the dialog itself is a click on the backdrop. -->
  <div class="p-5">
    <h2 id="request-title" class="text-lg font-bold text-slate-800">
      Request changes
    </h2>
    <p class="mt-2 leading-relaxed text-slate-700">
      A word that doesn't fit, a confusing picture, or a word you'd like added
      to the {pack.name} pack? Email us and we'll update it.
    </p>
    <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onclick={() => dialog?.close()}
        class="min-h-11 rounded-full px-4 font-semibold text-slate-600 hover:bg-slate-100"
      >
        Cancel
      </button>
      <a
        href={mailto}
        onclick={() => dialog?.close()}
        class="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 font-semibold text-white hover:bg-accent-dark active:bg-accent-dark"
      >
        Email support@teacher.dev
      </a>
    </div>
  </div>
</dialog>
