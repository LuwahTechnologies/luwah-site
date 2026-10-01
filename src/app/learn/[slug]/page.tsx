import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getGuides, getGuideBySlug, getGuideSlugs } from "@/lib/sanity";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structuredData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = (await getGuideSlugs()) ?? [];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};
  return pageMetadata({
    title: `${guide.title} | Learn`,
    description: guide.summary,
    path: `/learn/${slug}`,
  });
}

// Renders a body item: markdown heading or paragraph.
function Block({ text }: { text: string }) {
  if (text.startsWith("## ")) {
    return (
      <h2 className="mb-3 mt-8 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        {text.replace("## ", "")}
      </h2>
    );
  }
  return (
    <p className="mb-4 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
      {text}
    </p>
  );
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  // A few related entries from the same category.
  const related = (await getGuides())
    .filter((g) => g.category === guide.category && g.slug !== guide.slug)
    .slice(0, 4);

  return (
    <div className="pt-28 pb-24">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Learn", path: "/learn" },
          { name: guide.title, path: `/learn/${slug}` },
        ])}
      />
      <div className="mx-auto max-w-3xl px-6">
        <Link href="/learn" className="mb-8 inline-flex items-center gap-2 text-sm no-underline" style={{ color: "var(--color-text-secondary)" }}>
          <ArrowLeft size={16} /> Back to Learn
        </Link>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-copper)" }}>
          {guide.category}
        </p>
        <h1 className="mb-5 text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          {guide.title}
        </h1>
        {guide.summary && (
          <p className="mb-8 text-lg" style={{ color: "var(--color-text-secondary)" }}>{guide.summary}</p>
        )}
        <div>{(guide.body || []).map((b, i) => <Block key={i} text={b} />)}</div>

        {related.length > 0 && (
          <div className="mt-14 border-t pt-8" style={{ borderColor: "var(--color-border)" }}>
            <p className="mb-3 text-sm font-semibold">Related</p>
            <ul className="flex flex-col gap-1">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link href={`/learn/${g.slug}`} className="text-sm no-underline" style={{ color: "var(--color-copper)" }}>
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
