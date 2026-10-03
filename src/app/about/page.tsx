import { AboutContent } from "./AboutContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Daniel Cooke",
  description:
    "Nearly a decade of enterprise data engineering for Fortune 500 companies, now helping small businesses automate. Aurora, Colorado.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent />;
}
