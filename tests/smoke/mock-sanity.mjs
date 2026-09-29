// A stand-in for the Sanity query API, just enough for the smoke tests.
// GROQ is matched by substring against this site's own queries (see
// src/lib/sanity.ts), not parsed. If a query changes shape and this stops
// matching, the tests fail loudly rather than pass on empty data.
import http from "node:http";

export function createMockSanity() {
  const state = {
    /** "up" answers normally. "error" answers 503, like an API incident. */
    mode: "up",
    /** Documents by type. Each needs a `slug` string. */
    docs: { project: [], post: [], guide: [], review: [] },
    /** Every query received, trimmed, for assertions about what is fetched. */
    hits: [],
  };

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://mock");
    const query = url.searchParams.get("query") || "";
    const rawSlug = url.searchParams.get("$slug");
    const slug = rawSlug ? JSON.parse(rawSlug) : undefined;
    state.hits.push(query.replace(/\s+/g, " ").trim());

    if (state.mode === "error") {
      res.writeHead(503, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: { description: "mock outage" } }));
      return;
    }

    const type = (query.match(/_type == "(\w+)"/) || [])[1];
    const docs = state.docs[type];
    let result = null;
    if (docs) {
      if (query.includes("slug.current == $slug")) {
        result = docs.find((d) => d.slug === slug) ?? null;
      } else if (query.includes("defined(slug.current)")) {
        // The index query used by generateStaticParams and the sitemap.
        result = docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt }));
      } else {
        result = docs;
      }
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ms: 1, query, result }));
  });

  return {
    state,
    listen: (port) => new Promise((resolve) => server.listen(port, "127.0.0.1", resolve)),
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections?.();
        server.close(() => resolve());
      }),
  };
}
