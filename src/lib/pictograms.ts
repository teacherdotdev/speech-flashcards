// Pictures are bundled with the app (see scripts/download-pictograms.ts), and
// once loaded they are kept in IndexedDB, so later visits skip the network.
import { forgetImagesExcept, getImage, saveImage } from "#lib/image-store.ts";
import type { PictogramId } from "#lib/types.ts";

const files = import.meta.glob<string>("./pictograms/**/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

/** Pictures already loaded this visit, as in-memory URLs ready to show. */
const ready = new Map<PictogramId, string>();

function bundledUrl(id: PictogramId): string {
  const url = files[`./pictograms/${id}.png`];
  if (!url) throw new Error(`Missing ${id}.png; run: bun run pictograms`);
  return url;
}

export function pictogramUrl(id: PictogramId): string {
  return ready.get(id) ?? bundledUrl(id);
}

let tidiedUp = false;

/**
 * Get every picture ready to show instantly: from IndexedDB when saved there,
 * otherwise downloaded and saved for next time. Calls `onProgress` with the
 * number of pictures finished so far. Rejects if a download fails.
 */
export async function loadPictograms(
  ids: PictogramId[],
  onProgress: (done: number) => void,
) {
  if (!tidiedUp) {
    tidiedUp = true;
    // Ask the browser not to clear saved pictures when space runs low.
    navigator.storage?.persist?.().catch(() => {});
    void forgetImagesExcept(new Set(Object.values(files)));
  }

  let done = 0;
  await Promise.all(
    ids.map(async (id) => {
      if (!ready.has(id)) ready.set(id, await loadOne(bundledUrl(id)));
      onProgress(++done);
    }),
  );
}

async function loadOne(url: string): Promise<string> {
  let blob = await getImage(url);
  if (!blob) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load ${url}`);
    blob = await response.blob();
    await saveImage(url, blob);
  }
  const objectUrl = URL.createObjectURL(blob);
  // Decode now so the first showing of each card doesn't stutter.
  const image = new Image();
  image.src = objectUrl;
  await image.decode().catch(() => {});
  return objectUrl;
}
