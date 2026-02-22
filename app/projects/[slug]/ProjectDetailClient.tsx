"use client";

import type { Project } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Layout } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { MobileFrame } from "@/components/ui/mobile-frame";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

interface Props {
  project: Project;
  related: Partial<Project>[];
}

export default function ProjectDetailClient({ project, related }: Props) {
  const images = project.images || (project.image_url ? [project.image_url] : []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Back */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to projects
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col gap-6 mb-8">
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{project.category}</span>
                <h1 className="text-4xl sm:text-6xl font-roashe tracking-tight leading-tight">
                  {project.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border/30 text-sm hover:bg-accent transition-all"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-90 transition-all font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Site
                  </a>
                )}
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-foreground/5 border border-border/20 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">// overview</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {project.description}
                </p>
              </div>

              {project.long_description && (
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">// deep dive</h2>
                  <MarkdownRenderer content={project.long_description || ""} />
                </div>
              )}

              <div>
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">// tech stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-xl border border-border/30 bg-card/50 text-sm font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gallery Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative lg:sticky lg:top-24"
          >
            {images.length > 0 ? (
              <div className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide snap-x">
                {images.map((img, i) => (
                  <div key={i} className="shrink-0 snap-center">
                    <MobileFrame className="h-[500px] w-[250px] border-[10px] rounded-[2rem]">
                      <img 
                        src={img} 
                        alt={`${project.title} screen ${i + 1}`} 
                        className="w-full h-full object-cover pt-4"
                      />
                    </MobileFrame>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-[3/4] rounded-3xl border border-border/30 bg-card/50 flex items-center justify-center">
                <div className="text-center space-y-3 p-8">
                  <Layout className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                  <p className="text-xs font-mono text-muted-foreground/40 uppercase tracking-widest">Gallery Preview Placeholder</p>
                </div>
              </div>
            )}
            <p className="text-[10px] font-mono text-muted-foreground/40 text-center uppercase tracking-[0.3em] mt-2 italic">
              {images.length > 1 ? "← Swipe to explore screens →" : "// mobile viewport preview"}
            </p>
          </motion.div>
        </div>

        {/* Related projects */}
        {related && related.length > 0 && (
          <div className="mt-32 pt-16 border-t border-border/10">
            <h2 className="text-xl font-medium mb-8">Next in {project.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug || p.id}`}
                  className="p-6 rounded-2xl border border-border/30 bg-card/30 hover:border-border/60 transition-all hover:-translate-y-1 group"
                >
                  <h3 className="text-base font-medium mb-2 group-hover:text-foreground transition-colors">{p.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
