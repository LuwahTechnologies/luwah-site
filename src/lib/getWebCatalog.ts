import { sanityQuery } from "@/lib/sanity";
import { DEFAULT_CATALOG, type WebCatalog } from "@/lib/webCatalog";

/**
 * Reads the Sanity catalog and merges it over the code defaults. Any field the
 * editor leaves empty keeps its default, so the catalog never renders blank.
 * Lives apart from webCatalog.ts so client components can import the pure
 * pricing logic without pulling in the Sanity client.
 *
 * Pages call it bare, so an outage keeps the last good page. Request handlers
 * that price an order pass `failOpen` and get the defaults instead of a 500.
 */
export async function getWebCatalog(opts: { failOpen?: boolean } = {}): Promise<WebCatalog> {
  const doc = await sanityQuery<Partial<WebCatalog>>(
    "webCatalog",
    "webCatalog",
    `*[_type == "webCatalog"][0]`,
    {},
    opts
  );
  if (!doc) return DEFAULT_CATALOG;
  return {
    intro: doc.intro || DEFAULT_CATALOG.intro,
    perPagePrice: doc.perPagePrice ?? DEFAULT_CATALOG.perPagePrice,
    tiers: doc.tiers?.length ? doc.tiers : DEFAULT_CATALOG.tiers,
    addons: doc.addons?.length ? doc.addons : DEFAULT_CATALOG.addons,
    supportPlans: doc.supportPlans?.length ? doc.supportPlans : DEFAULT_CATALOG.supportPlans,
    legal: doc.legal || DEFAULT_CATALOG.legal,
  };
}
