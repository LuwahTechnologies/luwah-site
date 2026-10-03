import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about working with Luwah Technologies: process, pricing, hosting, ownership, and support.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="pt-24">
      <FAQSection />
      <div className="pb-24 text-center">
        <Link href="/contact" className="btn-secondary">Still have a question? Contact us</Link>
      </div>
    </div>
  );
}
