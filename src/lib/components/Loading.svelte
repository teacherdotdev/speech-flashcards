<script lang="ts">
  import { onMount } from "svelte";
  import { pictogramIds } from "#lib/packs/index.ts";
  import { loadPictograms } from "#lib/pictograms.ts";
  import type { SoundPack } from "#lib/types.ts";

  let {
    pack,
    onReady,
    onCancel,
  }: { pack: SoundPack; onReady: () => void; onCancel: () => void } = $props();

  // svelte-ignore state_referenced_locally
  const ids = pictogramIds(pack);
  let done = $state(0);
  let failed = $state(false);
  let cancelled = false;

  async function load() {
    failed = false;
    try {
      await loadPictograms(ids, (count) => (done = count));
      if (!cancelled) onReady();
    } catch {
      failed = true;
    }
  }

  onMount(() => {
    load();
    return () => (cancelled = true);
  });
</script>

<main
  class="flex min-h-screen-safe flex-col items-center justify-center gap-8 p-6 text-center"
>
  {#if failed}
    <p class="text-2xl font-bold text-slate-800">Some pictures didn't load.</p>
    <p class="max-w-md text-slate-600">
      Check the internet connection, then try again. Pictures that loaded are
      saved, so this only needs to happen once.
    </p>
    <div class="flex gap-3">
      <button
        type="button"
        onclick={onCancel}
        class="rounded-2xl bg-white px-6 py-3 text-xl font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
      >
        ← Back
      </button>
      <button
        type="button"
        onclick={load}
        class="rounded-2xl bg-accent px-6 py-3 text-xl font-bold text-white shadow-sm hover:bg-accent-dark"
      >
        Try again
      </button>
    </div>
  {:else}
    <!-- Fades in after a moment, so pictures already saved on the device don't flash this screen. -->
    <div
      class="flex animate-[fade-in_0.3s_ease-out_0.25s_both] flex-col items-center gap-8"
      role="status"
    >
      <div class="flex items-end gap-3" aria-hidden="true">
        {#each ["bg-accent", "bg-teal-400", "bg-accent-soft"] as color, i (color)}
          <div
            class="h-20 w-14 rounded-xl border-2 border-white shadow-md motion-safe:animate-hop {color}"
            style="animation-delay: {i * 0.15}s"
          ></div>
        {/each}
      </div>
      <p class="text-2xl font-bold text-slate-800">
        Getting the {pack.name} cards ready…
      </p>
      <div class="flex w-64 flex-col gap-2">
        <div class="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            class="h-full rounded-full bg-accent transition-[width]"
            style="width: {(done / ids.length) * 100}%"
          ></div>
        </div>
        <p class="text-slate-600">{done} of {ids.length} pictures</p>
      </div>
    </div>
  {/if}
</main>
