import { ConsultationForm } from "./ConsultationForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Consultation",
  description:
    "Book a free 30-minute consultation. Tell us about your business, we'll tell you what's possible. No pressure.",
  path: "/consultation",
});

export default function ConsultationPage() {
  return <ConsultationForm />;
}
