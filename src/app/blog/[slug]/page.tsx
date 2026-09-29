import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/data/posts";
import { getSanityPostBySlug, getSanityPostSlugs } from "@/lib/sanity";
import { BlogPostContent } from "./BlogPostContent";
import { JsonLd } from "@/components/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/structuredData";
import { pageMetadata, toIsoDate } from "@/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  // Sanity slugs plus the bundled ones, for the same reason as /work/[slug].
  const slugs = new Set([...((await getSanityPostSlugs()) ?? []), ...getAllPostSlugs()]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getSanityPostBySlug(slug)) ?? getPostBySlug(slug);
  if (!post) return {};

  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.image,
    type: "article",
    publishedTime: toIsoDate(post.date),
    modifiedTime: toIsoDate(post.updatedAt),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = (await getSanityPostBySlug(slug)) ?? getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <BlogPostContent post={post} />
    </>
  );
}
