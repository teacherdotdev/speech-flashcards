<script lang="ts" module>
  import { PACKS } from "#lib/packs/index.ts";

  /** The link that opens the panel, from this page or any other. */
  export const INFO_HASH = "#how-it-works";

  /** The questions answered at the end, also given to search engines. */
  export const FAQ = [
    {
      q: "Is it free?",
      a: "Yes. No paywalls, no ads and no sign-up.",
    },
    {
      q: "Do students need accounts?",
      a: "No. Nobody signs in. Open the page and start.",
    },
    {
      q: "What devices does it work on?",
      a: "Any device with a modern web browser: Chromebooks, iPads, phones, laptops and interactive whiteboards.",
    },
    {
      q: "Can I use it for teletherapy?",
      a: "Yes. Share the browser tab in your video call and tap through the cards.",
    },
    {
      q: "Is any data collected?",
      a: "No. Your last sound and positions are remembered in this browser only, and nothing is sent anywhere.",
    },
  ];

  const wordCount = PACKS.reduce(
    (sum, pack) =>
      sum +
      Object.values(pack.cards).reduce(
        (n, cards) => n + (cards?.length ?? 0),
        0,
      ),
    0,
  );
</script>

<script lang="ts">
  /**
   * The help button in the bottom-left corner and the panel it opens: what
   * Speech Flashcards is, how to use it and what teachers ask about it.
   *
   * The panel is always in the document, and closing it only hides it. The
   * menu is mostly buttons, and this is the text search engines read from the
   * prerendered page to learn what the app is. `#how-it-works` opens it, so
   * the explanation can still be linked to on its own; no element carries
   * that id, so following the link never scrolls the page to find it.
   */

  import { replaceState } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { onMount, tick } from "svelte";

  let open = $state(false);
  let panel: HTMLElement;
  /** Where focus was before opening, to hand it back on close. */
  let returnFocus: HTMLElement | null = null;

  const heading = "mb-2 text-lg font-bold text-slate-800";
  const body = "leading-relaxed text-slate-700";
  const link = "font-semibold text-accent-dark underline underline-offset-2";

  function syncWithHash() {
    if (location.hash === INFO_HASH) open = true;
  }

  onMount(syncWithHash);

  $effect(() => {
    if (!open) return;
    returnFocus = document.activeElement as HTMLElement | null;
    // Without preventScroll the browser scrolls sideways to reveal a panel
    // that is still sliding in from past the right edge.
    void tick().then(() => panel.focus({ preventScroll: true }));
  });

  function close() {
    open = false;
    if (location.hash === INFO_HASH) {
      // Drop the hash so a reload doesn't reopen it, without a new history
      // entry and without SvelteKit treating it as a navigation.
      replaceState(resolve("/"), page.state);
    }
    returnFocus?.focus();
    returnFocus = null;
  }
</script>

<svelte:window
  onhashchange={syncWithHash}
  onkeydown={(event) => {
    if (open && event.key === "Escape") close();
  }}
/>

<button
  type="button"
  class="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-40 grid size-11 place-items-center rounded-full bg-white/95 text-slate-700 shadow-lg ring-1 ring-slate-200 hover:bg-white"
  aria-label="How it works"
  title="How it works"
  aria-expanded={open}
  aria-controls="how-it-works-panel"
  onclick={() => (open = true)}
>
  <svg
    viewBox="0 0 24 24"
    class="size-5"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
    <path d="M12 17.5h.01" />
  </svg>
</button>

<!-- Hidden with visibility rather than left out, so the words stay in the
     page; visibility also keeps a closed panel away from the keyboard and
     screen readers. Visibility transitions only on the way out, so the
     panel can slide shut before it disappears but is visible, and so
     focusable, the moment it opens. -->
<div
  class="fixed inset-0 z-50 flex justify-end duration-300 {open
    ? 'visible bg-slate-900/40 transition-colors'
    : 'invisible bg-transparent transition-[visibility,background-color]'}"
  role="presentation"
  onclick={(event) => event.target === event.currentTarget && close()}
>
  <div
    id="how-it-works-panel"
    bind:this={panel}
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-labelledby="how-it-works-title"
    class="h-full w-full max-w-md overflow-y-auto overscroll-contain bg-slate-50 p-4 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl transition-transform duration-300 outline-none sm:p-6 sm:pr-[max(1.5rem,env(safe-area-inset-right))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] {open
      ? ''
      : 'translate-x-full'}"
  >
    <div class="flex items-start justify-between gap-4">
      <h2 id="how-it-works-title" class="text-2xl font-bold text-accent-dark">
        How it works
      </h2>
      <button
        type="button"
        class="min-h-11 shrink-0 rounded-full border border-slate-300 bg-white px-4 font-semibold text-slate-700 hover:bg-slate-100"
        onclick={close}>Close</button
      >
    </div>
    <p class="mt-1 text-slate-600">
      Free picture flashcards for speech sound practice, for speech-language
      pathologists, teachers and families.
    </p>

    <section class="mt-6">
      <h3 class={heading}>What it is</h3>
      <p class={body}>
        Speech Flashcards is a deck of digital articulation cards. Each card
        shows one word with a clear picture, so a student can name it and
        practice their target sound. There are {PACKS.length} sound packs with
        {wordCount} words: R, vocalic R, S, L, both TH sounds, S-, R- and L-blends,
        K, G, T, D, F, V, SH, CH, J, Z and NG.
      </p>
    </section>

    <section class="mt-6">
      <h3 class={heading}>How to use it</h3>
      <ol class="list-decimal space-y-2 pl-5 {body}">
        <li>Pick a sound.</li>
        <li>
          Choose where the sound falls in the word: initial (beginning), medial
          (middle), final (end), or any mix.
        </li>
        <li>
          Press Start, then tap the card or press → or Space for the next one. ←
          goes back, and Esc returns to the menu.
        </li>
      </ol>
    </section>

    <section class="mt-6">
      <h3 class={heading}>An endless deck</h3>
      <p class={body}>
        Cards are shuffled, and every card is shown once before the deck
        reshuffles, so practice lasts as long as your session does. A word never
        comes back until at least three other words have been shown.
      </p>
    </section>

    <section class="mt-6">
      <h3 class={heading}>Where the words come from</h3>
      <p class={body}>
        The R pack was hand-picked by Natalie, a practicing speech therapist.
        The other packs use words most 4th graders know, sorted by where the
        sound falls in each word. The pictures are ARASAAC pictograms. See every
        word on the
        <a class={link} href={resolve("/packs")}>Flashcard packs</a> page.
      </p>
    </section>

    <section class="mt-6">
      <h3 class={heading}>Questions teachers ask</h3>
      <dl class="space-y-4">
        {#each FAQ as { q, a } (q)}
          <div>
            <dt class="font-bold text-slate-800">{q}</dt>
            <dd class="mt-1 {body}">{a}</dd>
          </div>
        {/each}
      </dl>
    </section>
  </div>
</div>
