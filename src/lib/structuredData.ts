import { SITE_NAME, SITE_URL, absoluteUrl, toIsoDate } from "@/lib/seo";

const BASE = SITE_URL;

const publisher = {
  "@type": "Organization",
  name: SITE_NAME,
  logo: { "@type": "ImageObject", url: `${BASE}/images/sharing-img-logo.jpg` },
};

/**
 * Site-wide Organization schema. Deliberately NOT LocalBusiness and with no
 * AggregateRating: Google disallows self-serving review markup, and a
 * service-area business has no public storefront address. areaServed is the US.
 */
export const organizationSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: BASE,
  logo: `${BASE}/images/sharing-img-logo.jpg`,
  description:
    "Custom automation, web development, and workflow solutions for small businesses. Based in the Denver metro, serving the entire USA.",
  areaServed: { "@type": "Country", name: "United States" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-720-421-7184",
    email: "hello@luwahtechnologies.com",
    contactType: "customer service",
    areaServed: "US",
    availableLanguage: "English",
  },
};

/** Lets Google show the site name in results. Homepage only. */
export const webSiteSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: BASE,
};

/** Trail for a detail page. `path` is the site path, the last item is the page. */
export function breadcrumbSchema(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** BlogPosting schema for an individual article. */
export function blogPostingSchema(post: {
  title: string;
  excerpt?: string;
  slug: string;
  date?: string;
  updatedAt?: string;
  image?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? absoluteUrl(post.image) : undefined,
    datePublished: toIsoDate(post.date),
    dateModified: toIsoDate(post.updatedAt),
    mainEntityOfPage: `${BASE}/blog/${post.slug}`,
    author: { "@type": "Organization", name: SITE_NAME, url: BASE },
    publisher,
  };
}

/**
 * Case study schema. Typed Article because a case study is an account of work,
 * not a product or a service listing. There is no datePublished: the source
 * only has a completion year, and an invented date is worse than none.
 */
export function caseStudySchema(project: {
  title: string;
  description?: string;
  slug: string;
  image?: string;
  updatedAt?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    image: project.image ? absoluteUrl(project.image) : undefined,
    dateModified: toIsoDate(project.updatedAt),
    mainEntityOfPage: `${BASE}/work/${project.slug}`,
    author: { "@type": "Organization", name: SITE_NAME, url: BASE },
    publisher,
  };
}
