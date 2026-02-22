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
  { top: "10%", left: "15%", rotate: "-5deg" },
  { top: "45%", left: "10%", rotate: "-12deg" },
  { top: "20%", left: "35%", rotate: "8deg" },
  { top: "55%", left: "25%", rotate: "5deg" },
  { top: "15%", left: "55%", rotate: "-7deg" },
  { top: "40%", left: "45%", rotate: "-3deg" },
  { top: "65%", left: "50%", rotate: "10deg" },
  { top: "10%", left: "75%", rotate: "4deg" },
  { top: "35%", left: "70%", rotate: "-8deg" },
  { top: "60%", left: "80%", rotate: "12deg" },
  { top: "75%", left: "15%", rotate: "-5deg" },
  { top: "80%", left: "40%", rotate: "3deg" },
  { top: "85%", left: "70%", rotate: "-10deg" },
  { top: "30%", left: "20%", rotate: "15deg" },
];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden py-24">
      <div className="max-w-7xl mx-auto w-full px-6 z-10 pointer-events-none">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // tech stack
          </p>
          <h2 className="text-3xl sm:text-4xl font-roashe tracking-tight mb-4">
            Technologies I Work With
          </h2>
        </CenterBurst>
      </div>

      <DraggableCardContainer className="absolute inset-0 w-full h-full">
        {/* Background Hint Text */}
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl text-center text-4xl md:text-6xl font-black text-foreground/[0.03] dark:text-foreground/[0.02] select-none uppercase tracking-tighter leading-none pointer-events-none">
          Master the code. <br />
          Rules of the Stack. <br />
          Fight for pure logic.
        </p>

        {/* Dynamic Interaction Hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce pointer-events-none opacity-40">
           <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
             Grab and toss around
           </span>
        </div>

        {skills.map((skill, index) => {
          const SkillIcon = getSkillIcon(skill.name);
          const pos = cardPositions[index % cardPositions.length];
          
          return (
            <DraggableCardBody 
              key={skill.id}
              className={cn(
                "absolute p-4 md:p-6",
                "w-48 h-48 md:w-64 md:h-64", // Scaled down for splash layout
                "rotate-0" // Resetting default rotate to let parent styles or random pos handle it
              )}
              style={{
                top: pos.top,
                left: pos.left,
                transform: `rotate(${pos.rotate})`
              }}
            >
              <div className="flex flex-col items-center justify-center gap-4 text-center h-full">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-foreground/5 dark:bg-foreground/10 border border-border/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {skill.image_url ? (
                    <img 
                      src={skill.image_url} 
                      alt={skill.name} 
                      className="w-full h-full object-contain p-3 md:p-4"
                    />
                  ) : (
                    <SkillIcon className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground group-hover:text-foreground transition-all duration-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold tracking-tight mb-1">{skill.name}</h3>
                  <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">{skill.category || 'Tech'}</span>
                </div>
              </div>
            </DraggableCardBody>
          );
        })}
      </DraggableCardContainer>
    </section>
  );
}
