import { BuildIntakeForm } from "./BuildIntakeForm";
import { getWebCatalog } from "@/lib/getWebCatalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Website Build Intake",
  description:
    "Tell us about your business, brand, pages, and content so we can build your website. Luwah Technologies intake form.",
  path: "/intake",
});

export const revalidate = 60;

export default async function IntakePage() {
  const catalog = await getWebCatalog();
  const tiers = catalog.tiers.map((t) => ({ key: t.key, name: t.name, priceLabel: t.priceLabel }));
  const addons = catalog.addons
    .filter((a) => a.orderable !== false)
    .map((a) => `${a.name} (${a.oneTimeLabel}${a.monthlyLabel ? `, ${a.monthlyLabel}` : ""})`);
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          Website build intake
        </h1>
        <p className="mb-10 text-base" style={{ color: "var(--color-text-secondary)" }}>
          The more detail you provide, the faster we can begin. Fields marked with an asterisk are
          required. Takes about 10 minutes.
        </p>
        <BuildIntakeForm tiers={tiers} addons={addons} />
      </div>
    </div>
  );
}
