"use client";

import React from "react";
import { PinContainer } from "@/components/ui/3d-pin";
import type { Social } from "@/lib/types";
import { Share2 } from "lucide-react";

interface SocialSectionProps {
  children?: React.ReactNode;
}

export function SocialList({ socials }: { socials: Social[] }) {
  if (!socials || socials.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
      {socials.map((social, index) => (
        <div 
          key={social.id} 
          className="animate-in fade-in zoom-in duration-700 delay-150"
          style={{ animationDelay: `${(index + 1) * 150}ms` }}
        >
          <PinContainer
            title={social.name}
            href={social.url}
            className="w-full"
            containerClassName="w-64 h-40"
          >
            <div 
              onClick={() => window.open(social.url, "_blank")}
              className="flex basis-full flex-col p-3 tracking-tight text-slate-100/50 sm:basis-1/2 w-56 h-36 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-xs text-slate-100 uppercase tracking-widest leading-none">
                  {social.name}
                </h3>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">Profile</span>
              </div>
              
              <div className="flex flex-1 w-full rounded-md bg-gradient-to-br from-violet-500/80 via-purple-500/80 to-blue-500/80 border border-white/5 overflow-hidden relative group/img shadow-2xl">
                {social.image_url ? (
                  <img 
                    src={social.image_url} 
                    alt={social.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 opacity-60 group-hover/img:opacity-100" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                     <Share2 className="w-6 h-6 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 group-hover/img:bg-transparent transition-colors" />
              </div>
              
              <div className="mt-2 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  {social.description || `Connect on ${social.name}`}
                </p>
              </div>
            </div>
          </PinContainer>
        </div>
      ))}
    </div>
  );
}

export default function SocialSection({ children }: SocialSectionProps) {
  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Share2 className="w-4 h-4 text-foreground/60" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-foreground/60">Professional Network</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-roashe text-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Connect With Me
          </h2>
          <p className="max-w-xl text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Find me on digital platforms to see my work, updates, or just to chat.
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}
