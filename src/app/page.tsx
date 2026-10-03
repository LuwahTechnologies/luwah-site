import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ImageDivider } from "@/components/ImageDivider";
import { getSiteSettings } from "@/lib/sanity";
import { getApprovedReviews } from "@/lib/reviews";
import { JsonLd } from "@/components/JsonLd";
import { webSiteSchema } from "@/lib/structuredData";
import { absoluteUrl } from "@/lib/seo";

const HOME_TITLE = "Automation and Web Design for Small Businesses | Aurora, CO";
const HOME_DESCRIPTION =
  "Custom automation, websites, and tech help for small businesses. n8n, Python, and AI-powered. Free consultation. Aurora, CO.";

// Absolute title, so the layout template does not add the site name twice.
export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Luwah Technologies",
    locale: "en_US",
    url: absoluteUrl("/"),
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: "/images/sharing-img-logo.jpg", width: 869, height: 976, alt: "Luwah Technologies" }],
  },
  twitter: {
    card: "summary",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/images/sharing-img-logo.jpg"],
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const [settings, reviews] = await Promise.all([getSiteSettings(), getApprovedReviews(5)]);

  // The top 5 approved reviews drive the "What our clients say" marquee.
  const testimonials = reviews.map((r) => ({
    quote: r.quote,
    name: r.reviewerName,
    title: [r.role, r.company].filter(Boolean).join(", "),
  }));
  return (
    <>
      <JsonLd data={webSiteSchema} />
      <HeroSection
        content={
          settings ? {
            eyebrow: settings.heroEyebrow,
            headline: settings.heroHeadline,
            subhead: settings.heroSubhead,
            primaryCtaLabel: settings.heroPrimaryCtaLabel,
            primaryCtaHref: settings.heroPrimaryCtaHref,
            secondaryCtaLabel: settings.heroSecondaryCtaLabel,
            secondaryCtaHref: settings.heroSecondaryCtaHref,
          } : undefined
        }
      />
      <ServicesSection />
      <ImageDivider
        src="/images/pexels-brett-sayles-4520560.jpg"
        alt="Server infrastructure"
      />
      <PortfolioSection />
      <TestimonialsSection testimonials={testimonials} />

      {/* Closing CTA pointing to the dedicated pages */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            Ready to automate or build?
          </h2>
          <p className="mb-8 text-base" style={{ color: "var(--color-text-secondary)" }}>
            Book a free consultation, or explore automation project levels and website builds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/consultation" className="btn-primary">Book a Free Consultation</Link>
            <Link href="/pricing" className="btn-secondary">Automation Project Levels</Link>
            <Link href="/web-design" className="btn-secondary">Website Builds</Link>
          </div>
        </div>
      </section>
    </>
  );
}
