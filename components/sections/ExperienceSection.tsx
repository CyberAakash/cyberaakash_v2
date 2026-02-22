"use client";

import type { Experience } from "@/lib/types";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { motion } from "framer-motion";

interface ExperienceSectionProps {
  experiences: Experience[];
}

function formatDate(d: string | null) {
  if (!d) return "Present";
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section-padding min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full px-6 relative">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-roashe tracking-tight mb-12">
            Where I&apos;ve Worked
          </h2>
        </CenterBurst>

        <CenterBurstStagger className="relative" staggerDelay={0.12}>
          {/* Timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/30" />

          <div className="space-y-1">
            {experiences.map((exp, i) => {
              const bullets = Array.isArray(exp.description) ? exp.description : exp.description ? [String(exp.description)] : [];

              return (
                <CenterBurstItem key={exp.id}>
                  <div className="relative flex gap-6 group py-6">
                    {/* Timeline dot */}
                    <div className="relative z-10 mt-1.5 shrink-0">
                      <div className="w-[10px] h-[10px] rounded-full bg-foreground/80 ring-4 ring-background" />
                      {!exp.end_date && i === 0 && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-foreground/20"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6 border-b border-border/10 last:border-0">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-medium">{exp.role}</h3>
                          <p className="text-sm text-muted-foreground">
                            {exp.company}
                            {exp.type && (
                              <span className="text-xs font-mono ml-2 text-muted-foreground/50">
                                · {exp.type}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground/50 shrink-0">
                          {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                        </span>
                      </div>

                      {/* Bullet points */}
                      {bullets.length > 0 && (
                        <ul className="space-y-1.5 mt-3">
                          {bullets.map((point, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-muted-foreground/70 leading-relaxed">
                              <span className="text-muted-foreground/30 mt-0.5 shrink-0">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {exp.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {exp.tech_stack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-foreground/5 text-muted-foreground/60 border border-border/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CenterBurstItem>
              );
            })}
          </div>
        </CenterBurstStagger>
      </div>
    </section>
  );
}
