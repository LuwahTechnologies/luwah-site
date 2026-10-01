import type { Metadata } from "next";

export const SITE_URL = "https://luwahtechnologies.com";
export const SITE_NAME = "Luwah Technologies";
const DEFAULT_IMAGE = "/images/sharing-img-logo.jpg";

/** Absolute URL for a site path, or an already-absolute URL passed through. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * Normalise a date to YYYY-MM-DD for structured data and sitemaps. Accepts an
 * ISO date, or the display form the "date" field is meant to hold ("Nov 20,
 * 2025"), which is not valid schema.org input. The Sanity field is free text,
 * so anything else, including a date with no year, returns undefined: the
 * Date constructor would guess (a missing year becomes 2001), and a wrong date
 * is worse than none.
 */
export function toIsoDate(value?: string): string | undefined {
  if (!value) return undefined;
  const iso = value.match(/^\d{4}-\d{2}-\d{2}/);
  if (iso) return iso[0];
  // "2025-11" is read as UTC and lands on the wrong day in some time zones.
  if (!/\b(19|20)\d{2}\b/.test(value) || /^\s*\d{4}(-\d{2})?\s*$/.test(value)) return undefined;
  const t = new Date(value);
  if (Number.isNaN(t.getTime())) return undefined;
  // A display date parses as local midnight, so read it back with local getters.
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
}

interface PageMeta {
  /** Page title without the site suffix. The layout template adds it. */
  title: string;
  description?: string;
  /** Site path, for example /work/some-slug. Becomes the canonical URL. */
  path: string;
  /** Path or URL of the page's own image. Falls back to the site logo. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Metadata for a detail page: title, description, canonical, Open Graph and
 * Twitter. A page-level `openGraph` replaces the layout's rather than merging
 * with it, so siteName and locale have to be repeated here.
 */
export function pageMetadata(p: PageMeta): Metadata {
  const url = absoluteUrl(p.path);
  const image = absoluteUrl(p.image || DEFAULT_IMAGE);
  const shareTitle = `${p.title} | ${SITE_NAME}`;
  const isArticle = p.type === "article";

  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      type: p.type ?? "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url,
      title: shareTitle,
      description: p.description,
      images: [{ url: image, alt: p.title }],
      ...(isArticle && p.publishedTime ? { publishedTime: p.publishedTime } : {}),
      ...(isArticle && p.modifiedTime ? { modifiedTime: p.modifiedTime } : {}),
    },
    twitter: {
      // The default logo is portrait, so it only suits the small card.
      card: p.image ? "summary_large_image" : "summary",
      title: shareTitle,
      description: p.description,
      images: [image],
    },
  };
}
