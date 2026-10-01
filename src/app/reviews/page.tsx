import type { Metadata } from "next";
import { ReviewsSection } from "@/components/ReviewsSection";
import { getApprovedReviews } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Client Reviews",
  description:
    "See how clients rate Luwah Technologies on communication, expertise, timeliness, value, and overall experience.",
};

// Per-request on purpose: an approval in Studio shows on the next page load. The
// webhook filter documented in automation/n8n-ai-blog.md covers siteSettings,
// webCatalog, post and project but not review, so no tag would be expired when
// a review is approved and a cached page would lag by up to a minute. To cache
// this page, add "review" to the webhook filter first and use revalidate = 60.
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  // There is no cached page to fall back on here, so a Sanity failure shows an
  // empty list, as it always did, instead of a 500.
  const reviews = await getApprovedReviews(undefined, { failOpen: true });
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[var(--container-max)] px-6 pt-12 text-center">
        <h1 className="text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          What clients say
        </h1>
      </div>
      <ReviewsSection reviews={reviews} />
    </div>
  );
}
