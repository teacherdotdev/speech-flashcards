import { PACKS } from "#lib/packs/index.ts";
import { POSITIONS, type Position } from "#lib/types.ts";

/** The teacher's last choices, remembered on this device only. */
export interface Settings {
  packId: string;
  positions: Position[];
}

const KEY = "speech-flashcards:settings";

export function loadSettings(): Settings {
  const fallback: Settings = { packId: PACKS[0].id, positions: ["initial"] };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
    const pack = PACKS.find((p) => p.id === saved?.packId);
    const positions = POSITIONS.filter((p) => saved?.positions?.includes(p));
    if (!pack || positions.length === 0) return fallback;
    return { packId: pack.id, positions };
  } catch {
    return fallback;
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // Private browsing or storage turned off: the app still works, it just won't remember.
  }
}
