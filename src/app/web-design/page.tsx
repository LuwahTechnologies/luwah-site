import { WebDesignSection } from "@/components/WebDesignSection";
import { getWebCatalog } from "@/lib/getWebCatalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Website Design & Build",
  description:
    "Fixed-price websites from $450. Realtor landing pages, marketing sites, and booking systems, plus custom builds from $4,000. Build, deploy, and 30 days of support included.",
  path: "/web-design",
});

export const revalidate = 60;

export default async function WebDesignPage() {
  const catalog = await getWebCatalog();
  return (
    <div className="pt-24">
      <WebDesignSection catalog={catalog} />
    </div>
  );
}
