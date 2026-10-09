<script lang="ts">
  import InfoPage from "#lib/components/InfoPage.svelte";

  const link = "font-semibold text-accent-dark underline underline-offset-2";
</script>

<InfoPage title="Privacy" lede="What we collect, what we don't, and why.">
  <section
    class="flex flex-col gap-3 rounded-2xl bg-white p-5 leading-relaxed text-slate-700 shadow-sm"
  >
    <p>
      Speech Flashcards has no accounts and collects no personal information
      from teachers or students. It has no ads, no analytics, and sets no
      cookies.
    </p>
    <p>
      The sound and word positions you last picked are kept in this browser's
      local storage, so they're ready next time. The flashcard pictures are kept
      in the browser's own database on this device, so they load instantly on
      later visits. None of it is uploaded: Speech Flashcards has no server to
      send it to.
    </p>
    <p>
      The pictures come with the app itself, so practicing never contacts
      ARASAAC or any other outside service.
    </p>
    <p>
      Clearing this site's data in your browser erases everything Speech
      Flashcards has stored on this device.
    </p>
    <p>
      Questions or concerns? Email
      <a
        class={link}
        href="mailto:support@teacher.dev?subject=Speech%20Flashcards%20privacy"
        >support@teacher.dev</a
      >.
    </p>
  </section>
</InfoPage>
