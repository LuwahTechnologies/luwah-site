import { AboutContent } from "./AboutContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Daniel Cooke",
  description:
    "6+ years of enterprise data engineering, now helping small businesses automate. Fortune 10 experience. Aurora, Colorado.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent />;
}
