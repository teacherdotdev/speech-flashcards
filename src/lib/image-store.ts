// Keeps downloaded pictures in this browser's IndexedDB so packs load instantly
// next time. Entries are keyed by the picture's bundled URL, which includes a
// content hash in production builds, so a changed picture gets a fresh entry.
//
// Images are stored as { type, data: ArrayBuffer } rather than as Blobs: older
// iOS Safari versions had bugs storing Blobs in IndexedDB.

const DB_NAME = "speech-flashcards";
const STORE = "pictures";

interface StoredImage {
  type: string;
  data: ArrayBuffer;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => {
      // iOS can drop the connection while the app is in the background; reopen next time.
      req.result.onclose = () => (dbPromise = null);
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
  dbPromise.catch(() => (dbPromise = null));
  return dbPromise;
}

async function request<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = run(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** The saved picture for `url`, or undefined if it isn't saved (or storage is unavailable). */
export async function getImage(url: string): Promise<Blob | undefined> {
  try {
    const saved = await request<StoredImage | undefined>("readonly", (store) =>
      store.get(url),
    );
    return saved && new Blob([saved.data], { type: saved.type });
  } catch {
    return undefined;
  }
}

export async function saveImage(url: string, blob: Blob) {
  try {
    const saved: StoredImage = {
      type: blob.type,
      data: await blob.arrayBuffer(),
    };
    await request("readwrite", (store) => store.put(saved, url));
  } catch {
    // Private browsing or storage full: the picture just downloads again next time.
  }
}

/** Remove saved pictures the app no longer uses (old versions, removed words). */
export async function forgetImagesExcept(keep: Set<string>) {
  try {
    const urls = await request("readonly", (store) => store.getAllKeys());
    for (const url of urls) {
      if (typeof url === "string" && !keep.has(url)) {
        await request("readwrite", (store) => store.delete(url));
      }
    }
  } catch {
    // Nothing to tidy up if storage is unavailable.
  }
}
