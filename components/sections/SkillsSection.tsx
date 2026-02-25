"use client";

import type { Skill } from "@/lib/types";
import { cn } from "@/lib/utils";
import CenterBurst from "@/components/animations/CenterBurst";
import { CometCard } from "@/components/ui/comet-card";
import { motion } from "framer-motion";
import {
  Code, Braces, Server, Database, Terminal, Cpu, Shield, Globe, Layout, Cloud, Smartphone, Palette
} from "lucide-react";
import ShimmerText from "@/components/animations/ShimmerText";

interface SkillsSectionProps {
  children?: React.ReactNode;
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

import { InfiniteMarquee } from "@/components/animations/InfiniteMarquee";

export function SkillsList({ skills }: { skills: Skill[] }) {
  // Split skills into two groups for two rows
  const midPoint = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, midPoint);
  const row2 = skills.slice(midPoint);

  const SkillCard = ({ skill, index }: { skill: Skill, index: number }) => {
    const SkillIcon = getSkillIcon(skill.name);
    // Assign a rank for aesthetic
    const ranks = ['S', 'A', 'B', 'C'];
    const rank = ranks[index % ranks.length];
    
    return (
      <div className="h-32 w-48 flex-shrink-0 group relative overflow-hidden">
        {/* Solo Leveling System Card Aesthetic */}
        <div className="flex flex-col items-center justify-center gap-2 text-center w-full h-full px-4 border-[1px] border-blue-500/30 bg-[#0a0f18]/80 backdrop-blur-xl rounded-sm group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 relative">
          
          {/* Rank Badge */}
          <div className="absolute top-1 right-2">
            <span className="text-[10px] font-bold text-blue-400/50 group-hover:text-blue-400 transition-colors">RANK: {rank}</span>
          </div>
          
          {/* System Lines */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500/50" />

          {/* Glitch Overlay on Hover */}
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <div className="flex-1 w-full flex items-center justify-center pt-2">
            {skill.image_url ? (
              <img 
                src={skill.image_url} 
                alt={skill.name} 
                className="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 blue-glow"
              />
            ) : (
              <SkillIcon className="w-10 h-10 text-blue-400/40 group-hover:text-blue-400 transition-all duration-300 group-hover:scale-110" />
            )}
          </div>
          
          <div className="pb-4 px-2 w-full">
            <h3 className="text-[12px] font-bold tracking-[0.1em] text-blue-100/90 mb-0.5 truncate uppercase">
              {skill.name}
            </h3>
            <div className="w-full h-[1px] bg-blue-500/20 my-1 group-hover:bg-blue-400/40 transition-colors" />
            <p className="text-[7px] font-mono text-blue-400/40 uppercase tracking-[0.2em] truncate">
              TYPE: {skill.category || 'SKILL'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 1 }}
      className="relative w-full py-24 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Central Masking Guide: Cards fade in as they leave the center */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />

      {/* Row 1: Right Moving */}
      <div className="w-full relative py-6">
        <InfiniteMarquee direction="right" speed={35} className="mask-marquee">
          {row1.map((skill, i) => <SkillCard key={skill.id} skill={skill} index={i} />)}
        </InfiniteMarquee>
      </div>

      {/* Row 2: Left Moving */}
      <div className="w-full relative py-6">
        <InfiniteMarquee direction="left" speed={25} className="mask-marquee">
          {row2.map((skill, i) => <SkillCard key={skill.id} skill={skill} index={i} />)}
        </InfiniteMarquee>
      </div>

      {/* Central Hub: Sung Jinwoo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, x: "-50%" }}
        whileInView={{ opacity: 1, scale: 1, x: "-50%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="absolute top-[10rem] md:top-[10rem] left-1/2 z-20 pointer-events-none group w-full max-w-7xl flex justify-center px-4 md:px-8"
      >
        {/* Azure Aura Effect */}
        <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-[100px] animate-pulse group-hover:bg-blue-500/40 transition-colors duration-1000" />
        <div className="relative w-[400px] md:w-[450px] aspect-[4/5] flex items-center justify-center overflow-visible">
          <img 
            src="/assets/anime/sung-jinwoo.webp" 
            alt="Sung Jinwoo" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] opacity-90 transition-opacity"
          />
          
          {/* Shadow Aura Particles (Simulated) */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-t from-background to-transparent z-30" />
        </div>
      </motion.div>

      <style jsx global>{`
        .mask-marquee {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 35%,
            black 65%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 35%,
            black 65%,
            transparent
          );
        }
        .blue-glow {
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
        }
      `}</style>
    </motion.div>
  );
}

export default function SkillsSection({ children }: SkillsSectionProps) {
  return (
    <section id="skills" className="relative min-h-[120vh] w-full pt-32 pb-24 flex flex-col items-center overflow-hidden">
      {/* Dark Void Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/0 rounded-full blur-[200px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-8 relative z-30 text-center">
        <CenterBurst>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400/60 mb-4 text-center">
              // system interface v4.0.2
            </p>
            <h2 className="text-6xl sm:text-7xl font-roashe tracking-tight mb-8 text-center">
              <ShimmerText shimmerColor="#60a5fa">Hunter's Arsenal</ShimmerText>
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-blue-100/60 max-w-2xl mx-auto font-mono text-sm leading-relaxed text-center italic">
                "The System has finished analyzing your <span className="text-blue-400 glow-text">capabilities</span>. Your potential has been unlocked."
              </p>
              <div className="flex items-center gap-4 text-[10px] font-mono text-blue-500/40 uppercase tracking-widest">
                <span>STATUS: AWAKENED</span>
                <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                <span>CLASS: SHADOW MONARCH</span>
              </div>
            </div>
          </motion.div>
        </CenterBurst>
      </div>

      <div className="w-full relative z-20">
        {children}
      </div>

      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </section>
  );
}
