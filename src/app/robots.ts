import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the admin, the private review link, the status page and API routes
      // out of search. "$" anchors /review to that exact path. Without it the
      // rule is a prefix and also blocks the public /reviews page.
      disallow: ["/studio", "/review$", "/status", "/api/"],
    },
    sitemap: "https://luwahtechnologies.com/sitemap.xml",
  };
}
