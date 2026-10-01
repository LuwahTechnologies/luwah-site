import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { POSTS } from "@/data/posts";
import { getSanityPosts, type PostSummary } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "The Automation Lab | Blog",
  description:
    "Practical articles on small business automation, workflows, and technology strategy from a hands-on consultant.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts: PostSummary[] = (await getSanityPosts()) ?? POSTS;

  return (
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Automation Lab
          </h1>
          <p
            className="mb-14 max-w-lg text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Practical articles on automation, AI, and technology strategy for
            small businesses.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="no-underline"
              >
                <article className="card group h-full overflow-hidden transition-colors duration-200 hover:border-[rgba(212,146,79,0.3)]">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 370px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-3">
                      <span
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "var(--color-copper)" }}
                      >
                        {post.category}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {post.readTime}
                      </span>
                    </div>
                    <h2
                      className="mb-3 text-base font-semibold leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className="mb-3 text-sm leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {post.excerpt}
                    </p>
                    <p
                      className="mt-auto text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {post.date}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
