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
            target="_blank"
            rel="noopener noreferrer"
            className="w-[280px] h-[180px]"
          >
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[12rem] ">
              <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                {social.name}
              </h3>
              <div className="text-sm !m-0 !p-0 font-normal">
                <span className="text-slate-500 ">
                  {social.description || `Follow me on ${social.name}`}
                </span>
              </div>
              <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 overflow-hidden relative group">
                {social.image_url ? (
                  <img 
                    src={social.image_url} 
                    alt={social.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                     <Share2 className="w-12 h-12 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
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
    <section id="socials" className="py-20 relative overflow-hidden bg-background">
      <div className="container px-4 mx-auto">
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
