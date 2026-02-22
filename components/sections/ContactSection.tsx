"use client";

import CenterBurst from "@/components/animations/CenterBurst";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import type { About } from "@/lib/types";

interface ContactSectionProps {
  about: About | null;
}

const socials = [
  { icon: Github, label: "GitHub", key: "github_url" },
  { icon: Linkedin, label: "LinkedIn", key: "linkedin_url" },
];

export default function ContactSection({ about }: ContactSectionProps) {
  return (
    <section id="contact" className="section-padding min-h-[60vh] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full text-center">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-4">
            // contact
          </p>
          <h2 className="text-4xl sm:text-5xl font-roashe tracking-tight mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Have a project in mind or just want to chat? I&apos;m always open to new opportunities and ideas.
          </p>
        </CenterBurst>

        <CenterBurst delay={0.2}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href={`mailto:${about?.email || "cyberaakash@email.com"}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity group"
            >
              <Mail className="w-4 h-4" />
              Say Hello
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {socials.map((social) => (
              <a
                key={social.label}
                href={about?.[social.key as keyof About] as string || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-border/30 flex items-center justify-center hover:bg-accent hover:border-border/60 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </CenterBurst>
      </div>
    </section>
  );
}
