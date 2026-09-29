/**
 * Cache tags for Sanity reads. Every fetch is tagged with its document type, and
 * /api/revalidate expires that tag when the matching webhook fires. A page is
 * refreshed because it read the data, not because a hand-kept map says it does.
 * Kept free of the Sanity client so the route handler can import it cheaply.
 */
export const SANITY_DOC_TYPES = [
  "siteSettings",
  "webCatalog",
  "post",
  "project",
  "review",
  "guide",
] as const;

export type SanityDocType = (typeof SANITY_DOC_TYPES)[number];

export const sanityTag = (type: SanityDocType): string => `sanity:${type}`;

export const isSanityDocType = (type: string): type is SanityDocType =>
  (SANITY_DOC_TYPES as readonly string[]).includes(type);
