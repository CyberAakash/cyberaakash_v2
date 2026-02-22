"use client";

import type { Certification } from "@/lib/types";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { Award, ExternalLink } from "lucide-react";
import { EvervaultCard } from "@/components/ui/evervault-card";

interface CertificationsSectionProps {
  certifications: Certification[];
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
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

        <CenterBurstStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
          {certifications.map((cert) => (
            <CenterBurstItem key={cert.id}>
              <div className="group relative">
                <EvervaultCard className="h-[300px]">
                  <div className="flex flex-col h-full w-full justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-foreground/10 border border-border/30 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="text-lg font-bold line-clamp-2 leading-tight">{cert.title}</h3>
                        <p className="text-xs text-muted-foreground/60 font-mono mt-1 uppercase tracking-wider">{cert.issuer}</p>
                      </div>
                    </div>

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/30 text-xs font-mono text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest"
                      >
                        Verify Credential
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </EvervaultCard>
              </div>
            </CenterBurstItem>
          ))}
        </CenterBurstStagger>
      </div>
    </section>
  );
}
