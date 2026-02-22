"use client";

import type { Certification } from "@/lib/types";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { Award, ExternalLink } from "lucide-react";

interface CertificationsSectionProps {
  certifications: Certification[];
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <section id="certifications" className="section-padding">
      <div className="max-w-7xl mx-auto w-full">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // certifications
          </p>
          <h2 className="text-3xl sm:text-4xl font-roashe tracking-tight mb-12">
            Credentials
          </h2>
        </CenterBurst>

        <CenterBurstStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.08}>
          {certifications.map((cert) => (
            <CenterBurstItem key={cert.id}>
              <div className="p-5 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-border/30 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium line-clamp-2">{cert.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
                  </div>
                </div>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 text-xs font-mono text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    View credential
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </CenterBurstItem>
          ))}
        </CenterBurstStagger>
      </div>
    </section>
  );
}
