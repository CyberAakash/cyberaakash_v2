"use client";

import type { Skill } from "@/lib/types";
import { cn } from "@/lib/utils";
import CenterBurst from "@/components/animations/CenterBurst";
import { DraggableCardContainer, DraggableCardBody } from "@/components/ui/draggable-card";
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

// Fixed positions for "randomly splashed" look that maintains readability
// These coordinates are percentages of the container
const cardPositions = [
  { top: "5%", left: "5%", rotate: "-5deg" },
  { top: "35%", left: "2%", rotate: "-12deg" },
  { top: "15%", left: "30%", rotate: "8deg" },
  { top: "50%", left: "20%", rotate: "5deg" },
  { top: "10%", left: "50%", rotate: "-7deg" },
  { top: "40%", left: "40%", rotate: "-3deg" },
  { top: "60%", left: "45%", rotate: "10deg" },
  { top: "5%", left: "70%", rotate: "4deg" },
  { top: "30%", left: "65%", rotate: "-8deg" },
  { top: "55%", left: "75%", rotate: "12deg" },
  { top: "70%", left: "10%", rotate: "-5deg" },
  { top: "75%", left: "35%", rotate: "3deg" },
  { top: "80%", left: "65%", rotate: "-10deg" },
  { top: "25%", left: "15%", rotate: "15deg" },
];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="relative min-h-[140vh] w-full pt-32 pb-24 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 mb-12 relative z-0 pointer-events-none">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // tech stack
          </p>
          <h2 className="text-3xl sm:text-4xl font-roashe tracking-tight mb-4">
            Technologies I Work With
          </h2>
        </CenterBurst>
      </div>

      <div className="flex-1 relative">
        <DraggableCardContainer className="absolute inset-0 w-full h-full z-50">
          {/* Background Hint Text */}
          <p className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-12 text-center text-5xl md:text-9xl font-black text-foreground/[0.03] dark:text-foreground/[0.02] select-none uppercase tracking-tighter leading-[0.8] pointer-events-none">
            Master the code. <br />
            Rules of the Stack. <br />
            Fight for logic.
          </p>

          {/* Dynamic Interaction Hint */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce pointer-events-none opacity-40">
             <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
               Grab & Toss Anywhere
             </span>
          </div>

          {skills.map((skill, index) => {
            const SkillIcon = getSkillIcon(skill.name);
            const pos = cardPositions[index % cardPositions.length];
            
            return (
              <DraggableCardBody 
                key={skill.id}
                className={cn(
                  "absolute",
                  "w-48 h-48 md:w-72 md:h-72"
                )}
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: `rotate(${pos.rotate})`
                }}
              >
                <div className="flex flex-col items-center justify-center gap-4 text-center w-full h-full relative p-6">
                  <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                    {skill.image_url ? (
                      <img 
                        src={skill.image_url} 
                        alt={skill.name} 
                        className="w-[80%] h-[80%] object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <SkillIcon className="w-[60%] h-[60%] text-muted-foreground group-hover:text-foreground transition-all duration-300" />
                    )}
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-sm md:text-lg font-bold tracking-tight mb-0.5">{skill.name}</h3>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{skill.category || 'Technology'}</p>
                  </div>
                </div>
              </DraggableCardBody>
            );
          })}
        </DraggableCardContainer>
      </div>
    </section>
  );
}
