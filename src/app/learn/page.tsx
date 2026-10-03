import Link from "next/link";
import { getGuides } from "@/lib/sanity";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Learn",
  description:
    "Plain-language explainers for small business owners: domains, hosting, VPS, SEO, SSL, and more. By Luwah Technologies.",
  path: "/learn",
});

export const revalidate = 60;

export default async function LearnPage() {
  const guides = await getGuides();

  // Group by category, preserving the order the query returned.
  const byCategory = new Map<string, typeof guides>();
  for (const g of guides) {
    if (!byCategory.has(g.category)) byCategory.set(g.category, []);
    byCategory.get(g.category)!.push(g);
  }

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          Learn
        </h1>
        <p className="mb-12 max-w-2xl text-base" style={{ color: "var(--color-text-secondary)" }}>
          Clear explanations of the terms that come up when you build a website. No jargon.
        </p>

        {guides.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Guides are coming soon.
          </p>
        ) : (
          <div className="flex flex-col gap-12">
            {[...byCategory.entries()].map(([category, items]) => (
              <section key={category}>
                <h2 className="mb-5 text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-copper)" }}>
                  {category}
                </h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/learn/${g.slug}`}
                      className="card p-5 no-underline transition-all"
                    >
                      <p className="mb-1 font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
                        {g.title}
                      </p>
                      {g.summary && (
                        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                          {g.summary}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
