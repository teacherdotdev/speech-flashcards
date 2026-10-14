/**
 * Where Speech Flashcards lives on the web, for the few places that need
 * absolute addresses: canonical links, link previews, structured data and the
 * sitemap. The bare domain and speechflashcards.teacher.dev redirect to or
 * duplicate this, so search engines are pointed here and nowhere else.
 */

export const SITE_URL = "https://www.speechflashcards.com";

/** Every page a search engine should know about, in sitemap order. */
export const PAGES = ["/", "/packs", "/about", "/privacy"] as const;

export type PagePath = (typeof PAGES)[number];

/** The 1200×630 picture link previews show, in `static/`. */
export const PREVIEW_IMAGE = `${SITE_URL}/og-image.png`;

export function absoluteUrl(path: PagePath): string {
  return new URL(path, SITE_URL).href;
}
