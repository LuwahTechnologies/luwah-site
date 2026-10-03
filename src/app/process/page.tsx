import Link from "next/link";
import { ProcessSection } from "@/components/ProcessSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Process",
  description:
    "How Luwah Technologies takes your project from first call to live: discovery, build, review, and launch.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <div className="pt-24">
      <ProcessSection />
      <div className="pb-24 text-center">
        <Link href="/consultation" className="btn-primary">Book a free consultation</Link>
      </div>
    </div>
  );
}
