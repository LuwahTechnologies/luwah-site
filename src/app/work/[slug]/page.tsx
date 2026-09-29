import { notFound } from "next/navigation";
import { getProjectBySlug, getAllSlugs } from "@/data/projects";
import { getSanityProjectBySlug, getSanityProjectSlugs } from "@/lib/sanity";
import { CaseStudyContent } from "./CaseStudyContent";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, toIsoDate } from "@/lib/seo";
import { breadcrumbSchema, caseStudySchema } from "@/lib/structuredData";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const sanitySlugs = await getSanityProjectSlugs();
  const slugs = sanitySlugs ?? getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getSanityProjectBySlug(slug)) ?? getProjectBySlug(slug);
  if (!project) return {};

  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/work/${slug}`,
    image: project.image,
    type: "article",
    modifiedTime: toIsoDate(project.updatedAt),
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = (await getSanityProjectBySlug(slug)) ?? getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <JsonLd data={caseStudySchema({ ...project, slug })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Our Work", path: "/work" },
          { name: project.title, path: `/work/${slug}` },
        ])}
      />
      <CaseStudyContent project={project} />
    </>
  );
}
