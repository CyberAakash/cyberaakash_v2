"use client";

import type { Skill } from "@/lib/types";
import { cn } from "@/lib/utils";
import CenterBurst from "@/components/animations/CenterBurst";
import { CometCard } from "@/components/ui/comet-card";
import {
  Code, Braces, Server, Database, Terminal, Cpu, Shield, Globe, Layout, Cloud, Smartphone, Palette
} from "lucide-react";

interface SkillsSectionProps {
  skills: Skill[];
}

const skillIcons: Record<string, typeof Code> = {
  react: Braces, javascript: Braces, typescript: Braces,
  html: Code, css: Palette, "next.js": Layout,
  "node.js": Server, express: Server, mongodb: Database,
  postgresql: Database, python: Terminal, java: Cpu,
  solidity: Shield, ethereum: Globe, web3: Globe,
  docker: Cloud, git: Terminal, aws: Cloud,
  "react native": Smartphone, flutter: Smartphone,
  figma: Palette, default: Code,
};

function getSkillIcon(name: string) {
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(skillIcons)) {
    if (key.includes(k)) return Icon;
  }
  return skillIcons.default;
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="relative min-h-screen w-full pt-32 pb-24 flex flex-col items-center">
      <div className="max-w-7xl mx-auto w-full px-6 mb-16 relative z-10 text-center">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // tech stack
          </p>
          <h2 className="text-4xl sm:text-5xl font-roashe tracking-tight mb-4">
            Technologies I Work With
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-mono text-sm">
            A comprehensive set of tools and languages I use to bring ideas to life.
          </p>
        </CenterBurst>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {skills.map((skill) => {
          const SkillIcon = getSkillIcon(skill.name);
          
          return (
            <div key={skill.id} className="h-44 group">
              <CometCard className="h-full w-full">
                <div className="flex flex-col items-center justify-center gap-4 text-center w-full h-full p-6 border border-border/30 bg-card/50 backdrop-blur-sm rounded-2xl group-hover:border-border/60 transition-colors">
                  <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                    {skill.image_url ? (
                      <img 
                        src={skill.image_url} 
                        alt={skill.name} 
                        className="w-[70%] h-[70%] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <SkillIcon className="w-[50%] h-[50%] text-muted-foreground group-hover:text-foreground transition-all duration-300" />
                    )}
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-sm font-bold tracking-tight mb-0.5">{skill.name}</h3>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{skill.category || 'Technology'}</p>
                  </div>
                </div>
              </CometCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}
