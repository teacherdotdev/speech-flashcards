# Speech Flashcards

Picture flashcards for speech sound practice. The teacher picks a sound pack
(e.g. R) and where the sound falls in the word (initial, medial, final, or any
mix), then taps through cards for as long as the session lasts.

- **Endless, shuffled deck.** Every card is shown once per pass in random
  order, then the deck reshuffles. A word never comes back until at least three
  other words have been shown, even across the reshuffle (`src/lib/deck.ts`).
- **Controls:** tap the card or _Next_ (→ / Space); _Back_ (←) revisits
  earlier cards; Esc returns to the menu.
- **Remembers** the last pack and positions (`localStorage`) and keeps loaded
  pictures (IndexedDB) on the device. Nothing is sent anywhere.

## Adding a sound pack

1. Copy `src/lib/packs/r.ts` to e.g. `s.ts` and fill in the words. Leave out a
   position if the sound has no words for it.
2. Add it to `PACKS` in `src/lib/packs/index.ts`.
3. Run `bun run pictograms` to save the new pictures into `src/lib/pictograms/`.
   `bun test src` fails if any card's picture is missing.

Each word needs an ARASAAC pictogram id: search at https://arasaac.org/pictograms/search
and copy the number from the pictogram's page URL. Pictures are bundled with the
app, so practice never waits on ARASAAC. Pressing Start shows a short loading
screen while the pack's pictures load; they are then saved in IndexedDB
(`src/lib/image-store.ts`), so the next visit loads them from the device.

## Development

```sh
bun install
# from the workspace root — never run `bun run dev` directly:
./scripts/agent-dev.mjs speech-flashcards --no-pocketbase
bun test src && bun run check && bun run lint && bun run build
```

## Licensing

App code: Apache-2.0 (see `LICENSE.txt`). The ARASAAC pictograms in
`src/lib/pictograms/` are not covered by that license. The pictographic symbols used are the property
of the Government of Aragón and have been created by Sergio Palao for ARASAAC
(https://arasaac.org), that distributes them under Creative Commons License
BY-NC-SA. The ARASAAC API may only be used by non-commercial applications.
