// Loaded with `node --import` for both `next build` and `next start` in the
// smoke tests. Sends every request for a *.sanity.io host to the local mock
// (SMOKE_SANITY_ORIGIN), so the production code needs no test-only switch and
// the tests never touch the real project. Does nothing when the variable is
// unset.
const origin = process.env.SMOKE_SANITY_ORIGIN;

if (origin) {
  const target = new URL(origin);
  const realFetch = globalThis.fetch;

  globalThis.fetch = (input, init) => {
    const href = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(href);
    if (url.hostname.endsWith(".sanity.io")) {
      url.protocol = target.protocol;
      url.host = target.host;
      return realFetch(url.href, init);
    }
    return realFetch(input, init);
  };
}
