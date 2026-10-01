const { withSentryConfig } = require("@sentry/nextjs/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // k3s/Dockerfile sets NEXT_OUTPUT=standalone to get a self-contained server
  // for the container. Render leaves it unset and keeps using `next start`,
  // which does not work with standalone output.
  //
  // isrFlushToDisk: false keeps regenerated pages in memory instead of writing
  // them under .next/server/app, so the pod can run with a read-only root
  // filesystem. A restart serves the pages built into the image again.
  ...(process.env.NEXT_OUTPUT === "standalone"
    ? { output: "standalone", experimental: { isrFlushToDisk: false } }
    : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async headers() {
    // Baseline hardening on every route. SAMEORIGIN keeps the Sanity Studio
    // iframe at /studio working while blocking third-party framing/clickjacking.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Which build served this response. Handy behind Cloudflare, where a
          // stale edge copy and a failed deploy look the same from the browser.
          { key: "X-Build-Id", value: process.env.NEXT_PUBLIC_BUILD_ID || "unknown" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/hub",
        destination: "https://links.luwahtechnologies.com/@hub",
        permanent: false,
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: "luwah-technologies-llc",
  project: "javascript-nextjs",
});
