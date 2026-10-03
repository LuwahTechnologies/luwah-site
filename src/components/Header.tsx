"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchModal } from "./SearchModal";

interface NavItem {
  href: string;
  label: string;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: "Services",
    items: [
      { href: "/services", label: "Automation" },
      { href: "/web-design", label: "Web Design" },
      { href: "/pricing", label: "Project Levels" },
      { href: "/process", label: "Our Process" },
    ],
  },
  {
    label: "Work",
    items: [
      { href: "/work", label: "Case Studies" },
      { href: "/reviews", label: "Reviews" },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/blog", label: "Blog" },
      { href: "/learn", label: "Education" },
    ],
  },
  {
    label: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

export function Header() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null); // desktop dropdown
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null); // mobile accordion

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 20);
    if (currentY < 80) setVisible(true);
    else if (currentY > lastScrollY && currentY > 100) setVisible(false);
    else if (currentY < lastScrollY) setVisible(true);
    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); setOpenMenu(null); }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${visible ? "header-visible" : "header-hidden"}`}
        style={{
          backgroundColor: scrolled || openMenu ? "rgba(12, 10, 20, 0.85)" : "transparent",
          backdropFilter: scrolled || openMenu ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled || openMenu ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-6" style={{ height: "56px" }}>
          <Link href="/" className="no-underline">
            <Image src="/images/logo-navbar.png" alt="Luwah Technologies" width={280} height={70} priority style={{ height: "36px", width: "auto" }} />
          </Link>

          {/* Desktop grouped nav */}
          <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpenMenu(null)}>
            {NAV.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(group.label)}
                onFocus={() => setOpenMenu(group.label)}
                onBlur={(e) => {
                  // Close only when focus leaves the whole group, not between its links.
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpenMenu(null);
                }}
              >
                <button
                  className="nav-link flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                  style={{ color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => setOpenMenu(openMenu === group.label ? null : group.label)}
                  aria-expanded={openMenu === group.label}
                >
                  {group.label}
                  <ChevronDown size={14} style={{ transform: openMenu === group.label ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                <AnimatePresence>
                  {openMenu === group.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full min-w-[200px] rounded-xl p-2"
                      style={{ backgroundColor: "rgba(20, 17, 30, 0.98)", border: "1px solid var(--color-border)", backdropFilter: "blur(20px)" }}
                    >
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="block rounded-lg px-3 py-2 text-sm no-underline transition-colors"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <SearchModal />
            <span className="hidden lg:block">
              {/* Compact CTA: half the default btn-primary padding, same font size. */}
              <Link href="/consultation" className="btn-primary" style={{ padding: "0.4rem 1rem" }}>
                Get Started
              </Link>
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
              style={{ color: "var(--color-text-primary)", background: "none", border: "none", cursor: "pointer" }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile accordion menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 overflow-y-auto pt-20 pb-10 lg:hidden"
            style={{ backgroundColor: "rgba(12, 10, 20, 0.98)", backdropFilter: "blur(20px)" }}
          >
            <div className="mx-auto flex max-w-md flex-col gap-1 px-6">
              {NAV.map((group) => {
                const open = openMobileGroup === group.label;
                return (
                  <div key={group.label} className="border-b" style={{ borderColor: "var(--color-border)" }}>
                    <button
                      onClick={() => setOpenMobileGroup(open ? null : group.label)}
                      className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold"
                      style={{ color: "var(--color-text-primary)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      {group.label}
                      <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="flex flex-col pb-3">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-2 pl-4 text-base no-underline"
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <Link href="/consultation" onClick={() => setMobileOpen(false)} className="btn-primary mt-6 text-center">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
