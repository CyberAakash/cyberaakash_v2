"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail, ArrowUpRight, Twitter } from "lucide-react";
import Link from "next/link";
import type { About } from "@/lib/types";

interface FooterProps {
  about: About | null;
}

const footerLinks = {
  navigate: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
  ],
  connect: [
    { label: "GitHub", href: "https://github.com/cyberaakash", icon: Github },
    { label: "LinkedIn", href: "https://linkedin.com/in/cyberaakash", icon: Linkedin },
    { label: "Twitter", href: "#", icon: Twitter },
  ],
};

export default function Footer({ about }: FooterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer
      ref={ref}
      className="relative border-t border-border/30 bg-gradient-to-b from-background to-card"
    >
      {/* Large CTA */}
      <div className="section-padding pb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-4"
        >
          Got a project in mind?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-roashe tracking-tight"
        >
          Let&apos;s Talk
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <a
            href={`mailto:${about?.email || "cyberaakash@email.com"}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity group"
          >
            Say Hello
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Links grid */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-t border-border/20">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-roashe text-lg">
              CyberAakash
            </Link>
            <p className="text-xs text-muted-foreground/60 font-mono mt-2 leading-relaxed">
              Code. Build. Ship.
              <br />
              Full Stack Developer
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground/40 mb-3">
              Navigate
            </p>
            <ul className="space-y-2">
              {footerLinks.navigate.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground/40 mb-3">
              Connect
            </p>
            <ul className="space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={about?.[`${link.label.toLowerCase()}_url` as keyof About] as string || link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 relative group"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Email */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground/40 mb-3">
              Email
            </p>
            <a
              href={`mailto:${about?.email || "cyberaakash@email.com"}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
            >
              <Mail className="w-3.5 h-3.5" />
              {about?.email || "cyberaakash@email.com"}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/10 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-[11px] font-mono text-muted-foreground/30">
            © {new Date().getFullYear()} Aakash T. All rights reserved.
          </p>
          <p className="text-[11px] font-mono text-muted-foreground/20">
            Next.js · Supabase · Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
