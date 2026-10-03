"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { POSTS } from "@/data/posts";
import { PROJECTS } from "@/data/projects";

interface SearchItem {
  title: string;
  description: string;
  href: string;
  type: "page" | "blog" | "work";
  category?: string;
}

const PAGES: SearchItem[] = [
  { title: "Home", description: "Automation consulting for small businesses", href: "/", type: "page" },
  { title: "Services", description: "Custom automation solutions scoped to your business", href: "/services", type: "page" },
  { title: "Work", description: "Real results from real businesses", href: "/work", type: "page" },
  { title: "Pricing", description: "Transparent per-project pricing", href: "/pricing", type: "page" },
  { title: "Blog", description: "Practical articles on automation and AI", href: "/blog", type: "page" },
  { title: "About", description: "Meet the team behind Luwah Technologies", href: "/about", type: "page" },
  { title: "Contact", description: "Get in touch with us", href: "/contact", type: "page" },
  { title: "Free Consultation", description: "Book a free 30-minute discovery call", href: "/consultation", type: "page" },
  { title: "FAQ", description: "Frequently asked questions", href: "/#faq", type: "page" },
  { title: "Privacy Policy", description: "How we handle your data", href: "/privacy", type: "page" },
  { title: "Terms & Conditions", description: "Terms of service", href: "/terms", type: "page" },
];

const ALL_ITEMS: SearchItem[] = [
  ...PAGES,
  ...POSTS.map((p) => ({
    title: p.title,
    description: p.excerpt,
    href: `/blog/${p.slug}`,
    type: "blog" as const,
    category: p.category,
  })),
  ...PROJECTS.map((p) => ({
    title: p.title,
    description: p.description,
    href: `/work/${p.slug}`,
    type: "work" as const,
    category: p.category,
  })),
];

function searchItems(query: string): SearchItem[] {
  if (!query.trim()) return [];
  const terms = query.toLowerCase().split(/\s+/);
  return ALL_ITEMS.filter((item) => {
    const text = `${item.title} ${item.description} ${item.category ?? ""} ${item.type}`.toLowerCase();
    return terms.every((term) => text.includes(term));
  }).slice(0, 8);
}

const TYPE_LABELS: Record<string, string> = {
  page: "Page",
  blog: "Blog",
  work: "Case Study",
};

export function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchItems(query);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      const href = results[selectedIndex].href;
      close();
      router.push(href);
    }
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center"
        style={{
          color: "var(--color-text-secondary)",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px",
        }}
        aria-label="Search"
      >
        <Search size={18} />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            className="w-full max-w-xl overflow-hidden"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-5"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <Search size={18} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, blog posts, case studies..."
                className="flex-1 py-4 text-base outline-none"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--color-text-primary)",
                  border: "none",
                  fontFamily: "var(--font-body)",
                }}
              />
              <div className="flex items-center gap-2">
                <kbd
                  className="hidden text-xs sm:inline-block"
                  style={{
                    color: "var(--color-text-muted)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    padding: "2px 6px",
                  }}
                >
                  ESC
                </kbd>
                <button
                  onClick={close}
                  style={{
                    color: "var(--color-text-muted)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {query.trim() && results.length === 0 && (
                <div
                  className="px-5 py-8 text-center text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}

              {results.length > 0 && (
                <ul className="py-2">
                  {results.map((item, i) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className="flex items-start gap-4 px-5 py-3 no-underline transition-colors duration-100"
                        style={{
                          backgroundColor:
                            i === selectedIndex
                              ? "rgba(255,255,255,0.05)"
                              : "transparent",
                        }}
                        onMouseEnter={() => setSelectedIndex(i)}
                      >
                        <div className="flex-1">
                          <div
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {item.title}
                          </div>
                          <div
                            className="mt-0.5 line-clamp-1 text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {item.description}
                          </div>
                        </div>
                        <span
                          className="mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.05)",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {TYPE_LABELS[item.type]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {!query.trim() && (
                <div
                  className="px-5 py-8 text-center text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Start typing to search...
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div
              className="flex items-center gap-4 px-5 py-3 text-xs"
              style={{
                borderTop: "1px solid var(--color-border)",
                color: "var(--color-text-muted)",
              }}
            >
              <span>
                <kbd
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "4px",
                    padding: "1px 5px",
                  }}
                >
                  &uarr;
                </kbd>{" "}
                <kbd
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "4px",
                    padding: "1px 5px",
                  }}
                >
                  &darr;
                </kbd>{" "}
                to navigate
              </span>
              <span>
                <kbd
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "4px",
                    padding: "1px 5px",
                  }}
                >
                  Enter
                </kbd>{" "}
                to select
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
