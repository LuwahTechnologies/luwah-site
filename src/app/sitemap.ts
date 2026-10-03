import type { MetadataRoute } from "next";
import { POSTS } from "@/data/posts";
import { PROJECTS } from "@/data/projects";
import {
  getSanityPostIndex,
  getSanityProjectIndex,
  getGuideIndex,
  type IndexEntry,
} from "@/lib/sanity";
import { toIsoDate } from "@/lib/seo";

const BASE = "https://luwahtechnologies.com";

// Rebuilt hourly, and on demand when a post, project or guide changes (the
// reads inside are tagged, see lib/sanityTags.ts). Without this the sitemap was
// frozen at build time and new content stayed out of it until the next deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Prefer live Sanity slugs, fall back to the bundled static content.
  const posts: IndexEntry[] =
    (await getSanityPostIndex()) ??
    POSTS.map((p) => ({ slug: p.slug, updatedAt: toIsoDate(p.date) }));
  const projects: IndexEntry[] =
    (await getSanityProjectIndex()) ?? PROJECTS.map((p) => ({ slug: p.slug }));
  const guides: IndexEntry[] = (await getGuideIndex()) ?? [];

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    { path: "/services", priority: 0.9 },
    { path: "/web-design", priority: 0.9 },
    { path: "/pricing", priority: 0.8 },
    { path: "/process", priority: 0.6 },
    { path: "/work", priority: 0.8 },
    { path: "/blog", priority: 0.8 },
    { path: "/learn", priority: 0.8 },
    { path: "/reviews", priority: 0.6 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/faq", priority: 0.5 },
    { path: "/consultation", priority: 0.7 },
    { path: "/order", priority: 0.6 },
    { path: "/intake", priority: 0.5 },
    { path: "/intake/website", priority: 0.5 },
    { path: "/intake/automation", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/accessibility-statement", priority: 0.3 },
    { path: "/agreements", priority: 0.3 },
  ];

  // No lastModified for the fixed pages. Stamping them with "now" claims every
  // page changed on every regeneration, and search engines learn to ignore it.
  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    priority: r.priority,
  }));

  const add = (prefix: string, rows: IndexEntry[], priority: number) => {
    for (const row of rows) {
      entries.push({
        url: `${BASE}/${prefix}/${row.slug}`,
        lastModified: row.updatedAt,
        priority,
      });
    }
  };
  add("blog", posts, 0.6);
  add("work", projects, 0.6);
  add("learn", guides, 0.5);

  return entries;
}
