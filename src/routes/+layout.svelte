<script lang="ts">
  import "@fontsource/abeezee/latin-400.css";
  import "@fontsource/abeezee/latin-400-italic.css";
  import "./layout.css";
  import favicon from "#lib/assets/favicon.svg";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();

  // Cloudflare Web Analytics (cookieless page counts). The token is set only
  // for production builds on Vercel, so local and preview builds send nothing.
  const beaconToken = import.meta.env.VITE_CF_BEACON_TOKEN;
</script>

<svelte:head>
  <link rel="icon" href={favicon} type="image/svg+xml" />
  <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  {#if beaconToken}
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: beaconToken })}
    ></script>
  {/if}
</svelte:head>

{@render children()}
