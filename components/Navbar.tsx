"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Work" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 w-auto"
      >
        <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-background/70 backdrop-blur-xl border border-border/30 shadow-lg shadow-black/5 dark:shadow-white/5">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground text-background text-xs font-bold shrink-0"
          >
            CA
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5 px-2">
            {navLinks.map((link) => {
              const isHash = link.href.startsWith("/#");
              const isActive = isHash
                ? pathname === "/"
                : pathname.startsWith(link.href);

              if (isHash && pathname === "/") {
                // On homepage, use anchor scroll
                return (
                  <a
                    key={link.href}
                    href={link.href.replace("/", "")}
                    className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent/50"
                  >
                    {link.label}
                  </a>
                );
              }

              // On other pages, use Link to navigate home + hash
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm transition-colors rounded-full hover:bg-accent/50 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          {pathname === "/" ? (
            <a
              href="#contact"
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity ml-1"
            >
              Contact →
            </a>
          ) : (
            <Link
              href="/#contact"
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity ml-1"
            >
              Contact →
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent/50 transition-colors"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-roashe tracking-wide text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.07 }}
              >
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 px-8 py-3 rounded-full bg-foreground text-background text-sm font-medium"
                >
                  Contact →
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
