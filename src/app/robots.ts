import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the admin, the private review link, and API routes out of search.
      disallow: ["/studio", "/review", "/status", "/api/"],
    },
    sitemap: "https://luwahtechnologies.com/sitemap.xml",
  };
}
