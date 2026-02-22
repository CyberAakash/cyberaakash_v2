"use client";

import type { Skill } from "@/lib/types";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { DraggableCardContainer, DraggableCardBody } from "@/components/ui/draggable-card";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="section-padding min-h-screen flex flex-col justify-center" ref={ref}>
      <div className="max-w-7xl mx-auto w-full px-6">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // tech stack
          </p>
          <h2 className="text-3xl sm:text-4xl font-roashe tracking-tight mb-12">
            Technologies I Work With
          </h2>
        </CenterBurst>

        <CenterBurstStagger className="flex flex-wrap justify-center gap-6" staggerDelay={0.05}>
          {skills.map((skill) => {
            const SkillIcon = getSkillIcon(skill.name);
            return (
              <CenterBurstItem key={skill.id}>
                <DraggableCardContainer>
                  <DraggableCardBody className="w-32 h-32 md:w-40 md:h-40 p-4 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-colors group">
                    <div className="flex flex-col items-center justify-center gap-4 text-center h-full">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-foreground/5 border border-border/10 flex items-center justify-center overflow-hidden shrink-0">
                        {skill.image_url ? (
                          <img 
                            src={skill.image_url} 
                            alt={skill.name} 
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <SkillIcon className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                        )}
                      </div>
                      <span className="text-xs md:text-sm font-medium tracking-tight line-clamp-1">{skill.name}</span>
                    </div>
                  </DraggableCardBody>
                </DraggableCardContainer>
              </CenterBurstItem>
            );
          })}
        </CenterBurstStagger>
      </div>
    </section>
  );
}
