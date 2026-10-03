import { ServicesContent } from "./ServicesContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Automation Services",
  description:
    "20+ automation services from email setup to profitability dashboards. Fixed pricing starting at $150. See what we build.",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesContent />;
}
