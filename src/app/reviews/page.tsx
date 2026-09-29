import type { Metadata } from "next";
import { ReviewsSection } from "@/components/ReviewsSection";
import { getApprovedReviews } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Client Reviews",
  description:
    "See how clients rate Luwah Technologies on communication, expertise, timeliness, value, and overall experience.",
};

// Cached, not per-request. Approving a review in Studio fires the webhook, which
// expires the "sanity:review" tag and refreshes this page and the homepage
// marquee. The 60s revalidate is the backstop if a webhook is ever missed.
export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
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
