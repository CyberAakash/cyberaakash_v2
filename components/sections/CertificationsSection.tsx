"use client";

import type { Certification } from "@/lib/types";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { Award, ExternalLink } from "lucide-react";
import { EvervaultCard } from "@/components/ui/evervault-card";

interface CertificationsSectionProps {
  children?: React.ReactNode;
}

export function CertificationList({ certifications }: { certifications: Certification[] }) {
  return (
    <CenterBurstStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
      {certifications.map((cert) => (
        <CenterBurstItem key={cert.id}>
          <div className="group relative">
            <EvervaultCard className="h-[300px]">
              <div className="flex flex-col h-full w-full justify-end p-6">
                <div className="flex flex-col gap-2 text-left">
                  <div className="w-8 h-8 rounded-lg bg-foreground/10 border border-border/30 flex items-center justify-center shrink-0 mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-4 h-4 text-foreground" />
                  </div>
                  <h3 className="text-xl font-bold line-clamp-2 leading-tight tracking-tight group-hover:text-primary transition-colors">{cert.title}</h3>
                  <p className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-[0.2em]">{cert.issuer}</p>
                  
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-2 text-[10px] font-mono text-muted-foreground/40 hover:text-foreground transition-all uppercase tracking-[0.2em] group/link"
                    >
                      Verify <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </EvervaultCard>
          </div>
        </CenterBurstItem>
      ))}
    </CenterBurstStagger>
  );
}

export default function CertificationsSection({ children }: CertificationsSectionProps) {
  return (
    <section id="certifications" className="section-padding">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <CenterBurst>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
              // certifications
            </p>
            <h2 className="text-4xl sm:text-5xl font-roashe tracking-tight mb-4">
              Credentials & Badges
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto font-mono text-sm">
              Validating expertise through industry-recognized certifications.
            </p>
          </CenterBurst>
        </div>

        {children}
      </div>
    </section>
  );
}
