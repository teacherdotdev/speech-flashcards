<script lang="ts">
  import Loading from "#lib/components/Loading.svelte";
  import Practice from "#lib/components/Practice.svelte";
  import Setup from "#lib/components/Setup.svelte";
  import { PACKS } from "#lib/packs/index.ts";
  import { loadSettings, saveSettings, type Settings } from "#lib/settings.ts";

  let settings = $state(loadSettings());
  let screen = $state<"setup" | "loading" | "practice">("setup");
  let pack = $derived(PACKS.find((p) => p.id === settings.packId) ?? PACKS[0]);

  function start(chosen: Settings) {
    settings = chosen;
    saveSettings(chosen);
    screen = "loading";
  }
</script>

{#if screen === "loading"}
  <Loading
    {pack}
    onReady={() => (screen = "practice")}
    onCancel={() => (screen = "setup")}
  />
{:else if screen === "practice"}
  <Practice
    {pack}
    positions={settings.positions}
    onExit={() => (screen = "setup")}
  />
{:else}
  <Setup initial={settings} onStart={start} />
{/if}
