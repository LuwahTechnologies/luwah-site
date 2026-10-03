#!/usr/bin/env node

/**
 * One-time seed: create the `webCatalog` singleton with the 2026 defaults so
 * an editor sees the prices pre-filled in Studio. It reads the defaults from
 * src/lib/webCatalog.ts, so changing a price there and re-running keeps the
 * Studio document in step. Re-running REPLACES the document, so any edit made
 * in Studio is lost.
 *
 * Usage:  node scripts/seed-web-catalog.mjs
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * and a write-scoped SANITY_API_TOKEN in .env.local.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env.local ──────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = readFileSync(resolve(__dirname, "../.env.local"), "utf-8");
const env = {};
for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const [key, ...rest] = trimmed.split("=");
  env[key.trim()] = rest.join("=").trim();
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

// ── Catalog, read from the code defaults so the two never drift ───────
// Needs Node 24 or newer, which can import a .ts file directly.
const { DEFAULT_CATALOG: c } = await import("../src/lib/webCatalog.ts");
const withKey = (items) => items.map((x) => ({ _key: x.key, ...x }));
const doc = {
  _id: "webCatalog",
  _type: "webCatalog",
  intro: c.intro,
  perPagePrice: c.perPagePrice,
  legal: c.legal,
  tiers: withKey(c.tiers),
  addons: withKey(c.addons),
  supportPlans: withKey(c.supportPlans),
};

const result = await client.createOrReplace(doc);
console.log(`OK: seeded ${result._id} into ${dataset} (${doc.tiers.length} tiers, ${doc.addons.length} add-ons)`);
