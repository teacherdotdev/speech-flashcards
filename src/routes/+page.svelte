<script lang="ts">
  import Loading from "#lib/components/Loading.svelte";
  import Practice from "#lib/components/Practice.svelte";
  import { FAQ } from "#lib/components/HowItWorks.svelte";
  import PageMeta from "#lib/components/PageMeta.svelte";
  import Setup from "#lib/components/Setup.svelte";
  import { PACKS } from "#lib/packs/index.ts";
  import {
    DEFAULT_SETTINGS,
    saveSettings,
    type Settings,
  } from "#lib/settings.ts";
  import { SITE_URL, absoluteUrl } from "#lib/site.ts";

  const description =
    "Free picture flashcards for speech therapy and articulation practice. Pick a sound like R, S or TH, choose initial, medial or final, and tap through.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Speech Flashcards",
        url: absoluteUrl("/"),
        description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "teacher",
        },
        publisher: {
          "@type": "Organization",
          name: "teacher.dev",
          url: "https://teacher.dev",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  let settings = $state<Settings>(DEFAULT_SETTINGS);
  let screen = $state<"setup" | "loading" | "practice">("setup");
  let pack = $derived(PACKS.find((p) => p.id === settings.packId) ?? PACKS[0]);

  function start(chosen: Settings) {
    settings = chosen;
    saveSettings(chosen);
    screen = "loading";
  }
</script>

<PageMeta
  path="/"
  title="Speech Flashcards: free articulation picture cards"
  {description}
  {jsonLd}
/>

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
  <Setup onStart={start} />
{/if}
