import { PACKS } from "#lib/packs/index.ts";
import { POSITIONS, type Position } from "#lib/types.ts";

/** The teacher's last choices, remembered on this device only. */
export interface Settings {
  packId: string;
  positions: Position[];
}

const KEY = "speech-flashcards:settings";

/** What a first visit starts on, and what pages are prerendered with. */
export const DEFAULT_SETTINGS: Settings = {
  packId: PACKS[0].id,
  positions: ["initial"],
};

export function loadSettings(): Settings {
  const fallback = DEFAULT_SETTINGS;
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
