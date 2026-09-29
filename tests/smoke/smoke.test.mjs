/**
 * Smoke tests: `npm run test:smoke`.
 *
 * Builds the site and runs it against a mock Sanity, so it needs no secrets
 * and never touches the real project. It follows what Sanity does to a real
 * deploy:
 *
 *   1. Sanity is unreachable at build time. The build must still succeed and
 *      the pages must render from the bundled content.
 *   2. Sanity comes back. One webhook call must heal the pages that were
 *      built during the outage.
 *   3. Sanity fails while the site is running. The last good page must keep
 *      serving, not be replaced by the bundled fallback or a cached 404.
 *
 * It replaces .next, so stop `next dev` first. SMOKE_SKIP_BUILD=1 reuses an
 * existing build for quick reruns, which skips the build-time checks.
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createMockSanity } from "./mock-sanity.mjs";
import { PROJECTS } from "../../src/data/projects.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SECRET = "smoke-secret";
const BUILD_ID = "smoke-test";
const BUNDLED = PROJECTS[0]; // what /work/<slug> shows with no Sanity content
const SANITY_ONLY = "smoke-only-project"; // a slug that exists only in Sanity

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const freePort = () =>
  new Promise((resolve, reject) => {
    const s = net.createServer();
    s.on("error", reject);
    s.listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });

const project = (slug, title) => ({
  slug,
  title,
  category: "Smoke",
  description: "A project used only by the smoke tests.",
  image: "/images/qimono-cubes-2492010_1920.jpg",
  metrics: [{ value: "1", label: "Metric" }],
  overview: "Overview.",
  challenge: [],
  solution: [],
  technologies: [],
  updatedAt: "2026-09-01T00:00:00Z",
});

const mock = createMockSanity();
let mockPort;
let base;
let server;
let serverLog = "";
let buildLog = "";
let buildStatus = null;

function smokeEnv() {
  const env = {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    NEXT_PUBLIC_SANITY_PROJECT_ID: "smoke0000",
    NEXT_PUBLIC_SANITY_DATASET: "production",
    NEXT_PUBLIC_SENTRY_DSN: "", // never report to the real Sentry project
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
    REVALIDATION_SECRET: SECRET,
    SMOKE_SANITY_ORIGIN: `http://127.0.0.1:${mockPort}`,
    NODE_OPTIONS: [
      process.env.NODE_OPTIONS,
      `--import ${pathToFileURL(path.join(HERE, "redirect-sanity.mjs")).href}`,
    ]
      .filter(Boolean)
      .join(" "),
  };
  delete env.SANITY_API_TOKEN;
  return env;
}

async function get(p) {
  const res = await fetch(`${base}${p}`, { redirect: "manual" });
  return { status: res.status, headers: res.headers, text: await res.text() };
}

const h1 = (html) =>
  (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "").replace(/<[^>]+>/g, "").trim();

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

const revalidate = (body, secret = SECRET) =>
  fetch(`${base}/api/revalidate`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-revalidation-secret": secret },
    body: JSON.stringify(body),
  });

/** Retry an assertion. The first request after a webhook is served stale. */
async function eventually(fn, { timeout = 20000, every = 400 } = {}) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeout) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      await sleep(every);
    }
  }
  throw last;
}

function stopServer() {
  if (server?.pid) {
    try {
      process.kill(-server.pid, "SIGTERM"); // the whole process group
    } catch {}
  }
}

describe("smoke", { timeout: 15 * 60 * 1000 }, () => {
  before(async () => {
    mockPort = await freePort();
    const appPort = await freePort();
    base = `http://127.0.0.1:${appPort}`;
    const env = smokeEnv();

    // The mock is deliberately not listening yet: Sanity is unreachable now.
    if (!process.env.SMOKE_SKIP_BUILD) {
      rmSync(path.join(ROOT, ".next"), { recursive: true, force: true });
      const built = spawnSync("npm", ["run", "build"], {
        cwd: ROOT,
        env,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      });
      buildStatus = built.status;
      buildLog = `${built.stdout}\n${built.stderr}`;
    }

    server = spawn(
      process.execPath,
      [path.join(ROOT, "node_modules/next/dist/bin/next"), "start", "-p", String(appPort)],
      { cwd: ROOT, env, detached: true, stdio: ["ignore", "pipe", "pipe"] }
    );
    server.stdout.on("data", (d) => (serverLog += d));
    server.stderr.on("data", (d) => (serverLog += d));
    process.once("exit", stopServer);

    await eventually(async () => assert.equal((await get("/api/health")).status, 200), {
      timeout: 60000,
      every: 500,
    });
  });

  after(async () => {
    stopServer();
    await mock.close().catch(() => {});
    if (process.exitCode) console.error(`--- server log ---\n${serverLog.slice(-4000)}`);
  });

  describe("Sanity unreachable at build time", () => {
    it("the build succeeds", { skip: !!process.env.SMOKE_SKIP_BUILD }, () => {
      assert.equal(buildStatus, 0, buildLog.slice(-3000));
      // Guard against a vacuous pass: Sanity really was unreachable.
      assert.match(buildLog, /\[sanity\.[\w-]+\] fetch failed/);
    });

    it("renders the homepage", async () => {
      const res = await get("/");
      assert.equal(res.status, 200);
      assert.match(h1(res.text), /Automation Consulting/);
      assert.match(res.text, /application\/ld\+json/);
    });

    it("renders the contact page", async () => {
      const res = await get("/contact");
      assert.equal(res.status, 200);
      assert.match(h1(res.text), /Get in touch/);
    });

    it("renders a Sanity-driven route from the bundled content", async () => {
      const res = await get(`/work/${BUNDLED.slug}`);
      assert.equal(res.status, 200);
      assert.equal(decode(h1(res.text)), BUNDLED.title);
      assert.match(res.text, new RegExp(`rel="canonical" href="https://luwahtechnologies.com/work/${BUNDLED.slug}"`));
    });

    it("answers 5xx, never a 404, for a Sanity-only slug it cannot look up", async () => {
      const res = await get(`/work/${SANITY_ONLY}`);
      assert.ok(res.status >= 500, `expected 5xx, got ${res.status}`);
    });

    it("serves the sitemap and robots", async () => {
      const sitemap = await get("/sitemap.xml");
      assert.equal(sitemap.status, 200);
      assert.match(sitemap.text, new RegExp(`/work/${BUNDLED.slug}<`));
      assert.equal((await get("/robots.txt")).status, 200);
    });

    it("exposes the build id", async () => {
      const home = await get("/");
      assert.equal(home.headers.get("x-build-id"), BUILD_ID);
      const status = await get("/status");
      assert.equal(status.status, 200);
      assert.match(status.text, new RegExp(`data-testid="status-build"[^>]*>${BUILD_ID}<`));
      assert.match(status.text, /noindex/);
      assert.equal((await (await fetch(`${base}/api/health`)).json()).version, BUILD_ID);
    });

    it("rejects revalidation without the secret", async () => {
      assert.equal((await revalidate({ _type: "project" }, "")).status, 401);
      assert.equal((await revalidate({ _type: "project" }, "wrong")).status, 401);
    });
  });

  describe("Sanity comes back", () => {
    before(async () => {
      mock.state.docs.project = [
        project(BUNDLED.slug, "Smoke project A v1"),
        project(SANITY_ONLY, "Smoke project B v1"),
      ];
      await mock.listen(mockPort);
    });

    it("one webhook heals pages that were built during the outage", async () => {
      const res = await revalidate({ _type: "project" });
      assert.equal(res.status, 200);
      assert.deepEqual((await res.json()).tags, ["sanity:project"]);

      // The bundled page is served stale once while it rebuilds.
      await eventually(async () => {
        assert.equal(h1((await get(`/work/${BUNDLED.slug}`)).text), "Smoke project A v1");
      });
      const created = await get(`/work/${SANITY_ONLY}`);
      assert.equal(created.status, 200, "an outage must not leave a cached 404 behind");
      assert.equal(h1(created.text), "Smoke project B v1");
    });

    it("the same webhook refreshes the sitemap", async () => {
      await eventually(async () => {
        assert.match((await get("/sitemap.xml")).text, new RegExp(`/work/${SANITY_ONLY}<`));
      });
    });

    it("an edit shows up after the next webhook", async () => {
      mock.state.docs.project = [
        project(BUNDLED.slug, "Smoke project A v2"),
        project(SANITY_ONLY, "Smoke project B v2"),
      ];
      await revalidate({ _type: "project" });
      // Visit both, so both have v2 as their last good copy for the outage
      // tests below. A stale page is only rebuilt when someone requests it.
      for (const [slug, title] of [
        [BUNDLED.slug, "Smoke project A v2"],
        [SANITY_ONLY, "Smoke project B v2"],
      ]) {
        await eventually(async () => {
          assert.equal(h1((await get(`/work/${slug}`)).text), title);
        });
      }
    });

    it("the list page shows Sanity content, and its query does not fetch bodies", async () => {
      await eventually(async () => {
        const list = await get("/work");
        assert.equal(list.status, 200);
        assert.match(list.text, /Smoke project A v2/);
        assert.match(list.text, /Smoke project B v2/);
      });
      const projectList = mock.state.hits.filter(
        (q) => q.includes('_type == "project"') && q.includes("order(completed desc)")
      );
      assert.ok(projectList.length > 0, "no project list query was seen");
      for (const q of projectList) assert.doesNotMatch(q, /overview|challenge|solution/);
    });
  });

  describe("Sanity fails while the site is running", () => {
    before(() => {
      mock.state.mode = "error";
    });

    it("keeps serving the last good pages after a webhook marks them stale", async () => {
      assert.equal((await revalidate({ _type: "project" })).status, 200);

      // Each request triggers a rebuild that fails. Every response must
      // still be the v2 content, over enough time for the rebuilds to fail.
      const paths = [`/work/${BUNDLED.slug}`, `/work/${SANITY_ONLY}`];
      for (let round = 0; round < 6; round++) {
        for (const p of paths) {
          const res = await get(p);
          assert.equal(res.status, 200, `${p} round ${round}`);
          assert.match(h1(res.text), /Smoke project [AB] v2/, `${p} round ${round}`);
        }
        await sleep(2000);
      }
      const sitemap = await get("/sitemap.xml");
      assert.equal(sitemap.status, 200);
      assert.match(sitemap.text, new RegExp(`/work/${SANITY_ONLY}<`));
    });

    it("recovers without a restart", async () => {
      mock.state.mode = "up";
      mock.state.docs.project = [
        project(BUNDLED.slug, "Smoke project A v3"),
        project(SANITY_ONLY, "Smoke project B v3"),
      ];
      await revalidate({ _type: "project" });
      await eventually(async () => {
        assert.equal(h1((await get(`/work/${SANITY_ONLY}`)).text), "Smoke project B v3");
      });
    });
  });
});
