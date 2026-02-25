"use client";

import { Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ShimmerText from "@/components/animations/ShimmerText";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import type { Certification } from "@/lib/types";

interface CertificationsSectionProps {
  children?: React.ReactNode;
}

export function CertificationList({ certifications }: { certifications: Certification[] }) {
  return (
    <CenterBurstStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
      {certifications.map((cert) => (
        <CenterBurstItem key={cert.id}>
          <motion.div 
            whileHover={{ y: -5 }}
            className="group relative h-72 rounded-3xl border border-border/30 bg-card/20 backdrop-blur-xl overflow-hidden flex flex-col justify-end p-8 transition-colors hover:border-primary/30"
          >
            {/* Pattern Background: Highly visible accents */}
            <div className="absolute inset-0 z-0">
              <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                  maskImage: 'radial-gradient(circle at 100% 0%, black 40%, transparent 90%)',
                  WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black 40%, transparent 90%)',
                }}
              />
              {/* Subtle top-right glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-colors" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-background/50 border border-border/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-300">
                  <Award className="w-5 h-5 text-primary/70 group-hover:text-primary" />
                </div>
                
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-border/20 text-muted-foreground/40 hover:text-foreground hover:bg-accent transition-all group/link"
                  >
                    <ExternalLink className="w-3 h-3 group-hover/link:rotate-12 transition-transform" />
                  </a>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-[0.2em]">{cert.issuer}</p>
              </div>

              {cert.credential_url && (
                <div className="pt-2 border-t border-border/5">
                   <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/30">Verified Credential</p>
                </div>
              )}
            </div>
          </motion.div>
        </CenterBurstItem>
      ))}
    </CenterBurstStagger>
  );
}

export default function CertificationsSection({ children }: CertificationsSectionProps) {
  return (
    <section id="certifications" className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="mb-12">
          <CenterBurst>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2 text-center md:text-left">
              // certifications
            </p>
            <h2 className="text-4xl sm:text-5xl font-roashe tracking-tight mb-4 text-center md:text-left">
              <ShimmerText shimmerColor="#f59e0b">Credentials & Badges</ShimmerText>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto md:mx-0 font-mono text-sm text-center md:text-left">
              Validating expertise through industry-recognized certifications.
            </p>
          </CenterBurst>
        </div>

        {children}
      </div>
    </section>
  );
}
