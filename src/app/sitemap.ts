import type { MetadataRoute } from "next";
import { POSTS } from "@/data/posts";
import { PROJECTS } from "@/data/projects";
import { getSanityPostSlugs, getSanityProjectSlugs, getGuideSlugs } from "@/lib/sanity";

const BASE = "https://luwahtechnologies.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Prefer live Sanity slugs, fall back to the bundled static content.
  const postSlugs = (await getSanityPostSlugs()) ?? POSTS.map((p) => p.slug);
  const projectSlugs = (await getSanityProjectSlugs()) ?? PROJECTS.map((p) => p.slug);
  const guideSlugs = (await getGuideSlugs()) ?? [];

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
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/accessibility-statement", priority: 0.3 },
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    priority: r.priority,
  }));

  for (const slug of postSlugs) entries.push({ url: `${BASE}/blog/${slug}`, lastModified: now, priority: 0.6 });
  for (const slug of projectSlugs) entries.push({ url: `${BASE}/work/${slug}`, lastModified: now, priority: 0.6 });
  for (const slug of guideSlugs) entries.push({ url: `${BASE}/learn/${slug}`, lastModified: now, priority: 0.5 });

  return entries;
}
