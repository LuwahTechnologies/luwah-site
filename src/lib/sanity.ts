import { cache } from "react";
import { createClient, type SanityClient } from "@sanity/client";
import type { BlogPost } from "@/data/posts";
import type { Project } from "@/data/projects";
import { failClosedOnContentError, reportError } from "@/lib/report";
import { sanityTag, type SanityDocType } from "@/lib/sanityTags";

// ── Client ───────────────────────────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

let sanityClient: SanityClient | null = null;
if (projectId) {
  sanityClient = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: process.env.NODE_ENV === "production",
    // Public site must never see drafts. This keeps unvetted AI blog drafts
    // (and any other draft) off the live site until you Publish in Studio.
    perspective: "published",
  });
}

export { sanityClient };

export interface SanityQueryOptions {
  /** Read through a different client, for example one with the CDN off. */
  client?: SanityClient | null;
  /**
   * Return null on failure even in a running production server. For request
   * handlers (form posts) that have their own fallback and no cached page to
   * fall back on. Pages leave this off.
   */
  failOpen?: boolean;
}

/**
 * The one way this site reads Sanity.
 *
 * - Tags the request with its document type so /api/revalidate can expire every
 *   page that read it.
 * - Returns null when Sanity is not configured, so callers fall back to the
 *   bundled content.
 * - On a failed read it reports to Sentry, then either returns null (build and
 *   `next dev`, where the static fallbacks must render) or throws (a running
 *   production server). Throwing is what lets ISR keep serving the last good
 *   page. Returning null there would replace it with the bundled fallback, or
 *   with a cached 404 for a slug that only exists in Sanity.
 */
export async function sanityQuery<T>(
  scope: string,
  type: SanityDocType,
  query: string,
  params: Record<string, unknown> = {},
  { client = sanityClient, failOpen = false }: SanityQueryOptions = {}
): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, {
      next: { tags: [sanityTag(type)] },
    });
  } catch (err) {
    reportError(`sanity.${scope}`, err);
    if (!failOpen && failClosedOnContentError()) throw err;
    return null;
  }
}

// ── GROQ projections ─────────────────────────────────────────────────
// List views get list fields only. Bodies are fetched by the detail pages.
const postSummaryFields = `
  "slug": slug.current,
  title,
  date,
  category,
  readTime,
  image,
  excerpt
`;

const postFields = `${postSummaryFields},
  content
`;

const projectSummaryFields = `
  "slug": slug.current,
  category,
  title,
  description,
  image,
  metrics
`;

const projectFields = `${projectSummaryFields},
  client,
  location,
  industry,
  completed,
  overview,
  challenge,
  solution,
  technologies
`;

export type PostSummary = Omit<BlogPost, "content">;
export type ProjectSummary = Pick<
  Project,
  "slug" | "category" | "title" | "description" | "image" | "metrics"
>;

/** One row per published document, for generateStaticParams and the sitemap. */
export interface IndexEntry {
  slug: string;
  updatedAt?: string;
}

async function getIndex(
  scope: string,
  type: "post" | "project" | "guide"
): Promise<IndexEntry[] | null> {
  const rows = await sanityQuery<{ slug: string; updatedAt?: string }[]>(
    scope,
    type,
    `*[_type == "${type}" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
  );
  return rows && rows.length > 0 ? rows : null;
}

// ── Fetchers ─────────────────────────────────────────────────────────

export async function getSanityPosts(): Promise<PostSummary[] | null> {
  const posts = await sanityQuery<PostSummary[]>(
    "posts",
    "post",
    `*[_type == "post"] | order(date desc) { ${postSummaryFields} }`
  );
  return posts && posts.length > 0 ? posts : null;
}

// cache() shares one read between generateMetadata and the page in a render.
export const getSanityPostBySlug = cache(async (slug: string): Promise<BlogPost | null> =>
  sanityQuery<BlogPost>(
    "post",
    "post",
    `*[_type == "post" && slug.current == $slug][0] { ${postFields} }`,
    { slug }
  )
);

export const getSanityPostIndex = () => getIndex("post-index", "post");

export async function getSanityPostSlugs(): Promise<string[] | null> {
  return (await getSanityPostIndex())?.map((e) => e.slug) ?? null;
}

export async function getSanityProjects(): Promise<ProjectSummary[] | null> {
  const projects = await sanityQuery<ProjectSummary[]>(
    "projects",
    "project",
    `*[_type == "project"] | order(completed desc) { ${projectSummaryFields} }`
  );
  return projects && projects.length > 0 ? projects : null;
}

export const getSanityProjectBySlug = cache(async (slug: string): Promise<Project | null> =>
  sanityQuery<Project>(
    "project",
    "project",
    `*[_type == "project" && slug.current == $slug][0] { ${projectFields} }`,
    { slug }
  )
);

export const getSanityProjectIndex = () => getIndex("project-index", "project");

export async function getSanityProjectSlugs(): Promise<string[] | null> {
  return (await getSanityProjectIndex())?.map((e) => e.slug) ?? null;
}

// ── Site settings (editable copy) ────────────────────────────────────
export interface PricingTier {
  title: string;
  description?: string;
  price?: string;
  unit?: string;
  cta?: string;
  ctaHref?: string;
  features?: string[];
  highlight?: boolean;
}

export interface SiteSettings {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubhead?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  pricingIntro?: string;
  pricingTiers?: PricingTier[];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityQuery<SiteSettings>(
    "siteSettings",
    "siteSettings",
    `*[_type == "siteSettings"][0]`
  );
}

// ── Learn entries (guides) ───────────────────────────────────────────
export interface Guide {
  title: string;
  slug: string;
  category: string;
  summary?: string;
  body?: string[];
  order?: number;
}

export type GuideSummary = Omit<Guide, "body">;

const guideSummaryFields = `
  "slug": slug.current,
  title,
  category,
  summary,
  order
`;

const guideFields = `${guideSummaryFields},
  body
`;

export async function getGuides(): Promise<GuideSummary[]> {
  return (
    (await sanityQuery<GuideSummary[]>(
      "guides",
      "guide",
      `*[_type == "guide"] | order(category asc, order asc) { ${guideSummaryFields} }`
    )) ?? []
  );
}

export const getGuideBySlug = cache(async (slug: string): Promise<Guide | null> =>
  sanityQuery<Guide>(
    "guide",
    "guide",
    `*[_type == "guide" && slug.current == $slug][0] { ${guideFields} }`,
    { slug }
  )
);

export const getGuideIndex = () => getIndex("guide-index", "guide");

export async function getGuideSlugs(): Promise<string[] | null> {
  return (await getGuideIndex())?.map((e) => e.slug) ?? null;
}
