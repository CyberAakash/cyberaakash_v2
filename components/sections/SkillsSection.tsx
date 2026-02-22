"use client";

import type { Skill } from "@/lib/types";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import {
  Code, Server, Globe, Wrench,
  Braces, Database, Shield, Cpu, Layout,
  Palette, Terminal, Cloud, Smartphone,
} from "lucide-react";

interface SkillsSectionProps {
  skills: Skill[];
}

const categoryMeta: Record<string, { icon: typeof Code; description: string }> = {
  frontend: { icon: Layout, description: "Building beautiful, responsive interfaces" },
  backend: { icon: Server, description: "APIs, databases & server architecture" },
  web3: { icon: Globe, description: "Blockchain, smart contracts & decentralized apps" },
  tools: { icon: Wrench, description: "DevOps, testing & development tools" },
  devops: { icon: Cloud, description: "Infrastructure, CI/CD & automation" },
  mobile: { icon: Smartphone, description: "Building cross-platform mobile apps" },
  design: { icon: Palette, description: "UI/UX & visual creativity" },
};

const categoryIcons: Record<string, typeof Code> = {
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
  for (const [k, Icon] of Object.entries(categoryIcons)) {
    if (key.includes(k)) return Icon;
  }
  return categoryIcons.default;
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const categories = useMemo(() => {
    const grouped: Record<string, Skill[]> = {};
    skills.forEach((s) => {
      const cat = s.category.toLowerCase();
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(s);
    });
    return grouped;
  }, [skills]);

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

        {/* Bento Grid */}
        <CenterBurstStagger className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.1}>
          {Object.entries(categories).map(([cat, catSkills], idx) => {
            const meta = categoryMeta[cat] || { icon: Code, description: `Skills related to ${cat}` };
            const CategoryIcon = meta.icon;

            return (
              <CenterBurstItem
                key={cat}
                className={`p-6 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-colors ${
                  idx === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border/30 flex items-center justify-center">
                    <CategoryIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium capitalize">{cat}</h3>
                    <p className="text-xs text-muted-foreground">{meta.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill) => {
                    const SkillIcon = getSkillIcon(skill.name);
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.3 + Math.random() * 0.3 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/20 bg-background/50 text-[11px] font-mono hover:border-foreground/20 hover:bg-accent/30 transition-all cursor-default group"
                      >
                        <SkillIcon className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                        {skill.name}
                        {skill.proficiency >= 80 && (
                          <span className="w-1 h-1 rounded-full bg-foreground/40" title="Advanced" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CenterBurstItem>
            );
          })}
        </CenterBurstStagger>
      </div>
    </section>
  );
}
