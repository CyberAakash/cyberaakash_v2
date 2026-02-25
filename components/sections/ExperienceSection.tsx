"use client";

import type { Experience } from "@/lib/types";
import { Timeline } from "@/components/ui/timeline";
import CenterBurst from "@/components/animations/CenterBurst";
import ShimmerText from "@/components/animations/ShimmerText";

interface ExperienceSectionProps {
  children?: React.ReactNode;
}

function formatDate(d: string | null) {
  if (!d) return "Present";
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatYear(d: string | null) {
  if (!d) return "Present";
  return new Date(d).getFullYear().toString();
}

export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const data = experiences.map((exp) => {
    const bullets = Array.isArray(exp.description) ? exp.description : exp.description ? [String(exp.description)] : [];
    
    return {
      title: formatYear(exp.start_date),
      content: (
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl md:text-2xl font-roashe tracking-tight text-foreground">
              {exp.role}
            </h3>
            <div className="flex items-center gap-2 text-sm md:text-base font-mono text-muted-foreground uppercase tracking-wider">
              <span>{exp.company}</span>
              {exp.type && <span className="text-muted-foreground/70">• {exp.type}</span>}
              <span className="text-muted-foreground/70 ml-auto text-[10px] font-sans">
                {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {bullets.length > 0 && (
              <ul className="space-y-2">
                {bullets.map((point: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-sm md:text-base text-muted-foreground/80 leading-relaxed group/item">
                    <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_8px_#3b82f6]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {exp.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {exp.tech_stack.map((tech: string) => (
                  <span
                    key={tech}
                    className="text-[10px] md:text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    };
  });

  return <Timeline data={data} />;
}

export default function ExperienceSection({ children }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section-padding bg-black relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative">
        <div className="mb-10">
          <CenterBurst>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-4">
              // experience
            </p>
            <h2 className="text-4xl md:text-6xl font-roashe tracking-tight">
              <ShimmerText shimmerColor="#3b82f6">Where I&apos;ve Worked</ShimmerText>
            </h2>
          </CenterBurst>
        </div>

        {children}
      </div>
    </section>
  );
}
