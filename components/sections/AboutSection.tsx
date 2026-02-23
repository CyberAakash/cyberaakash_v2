"use client";

import type { About } from "@/lib/types";
import BlurTextReveal from "@/components/animations/BlurTextReveal";
import ScrollTextReveal from "@/components/animations/ScrollTextReveal";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Code, Gamepad2, Dumbbell, BookOpen, Brain, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface AboutSectionProps {
  about: About | null;
  children?: React.ReactNode;
}

const routine = [
  { icon: Code, label: "code", color: "text-blue-500" },
  { icon: Gamepad2, label: "play", color: "text-purple-500" },
  { icon: Dumbbell, label: "gym", color: "text-orange-500" },
  { icon: BookOpen, label: "learn", color: "text-green-500" },
  { icon: Brain, label: "think", color: "text-pink-500" },
  { icon: Moon, label: "sleep", color: "text-indigo-500" },
];

const stats = [
  { label: "Projects Built", value: "15+" },
  { label: "Technologies", value: "20+" },
  { label: "Years Coding", value: "3+" },
  { label: "Cups of Coffee", value: "∞" },
];

export default function AboutSection({ about, children }: AboutSectionProps) {
  const words = ["products", "systems", "experiences", "solutions"];

  return (
    <section id="about" className="section-padding min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section label */}
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-8">
            // about
          </p>
        </CenterBurst>

        {/* Name + FlipWords */}
        <CenterBurst delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-roashe tracking-tight mb-4">
            {about?.name || "Aakash T"}
          </h2>
        </CenterBurst>

        <CenterBurst delay={0.15}>
          <div className="text-xl sm:text-2xl text-muted-foreground mb-8">
            I build <FlipWords words={words} className="text-foreground font-medium" />
          </div>
        </CenterBurst>

        {/* Bio with blur text reveal */}
        <div className="max-w-2xl mb-16">
          <BlurTextReveal className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {about?.bio || "Full-stack developer with a passion for building products that matter. Focused on clean code, scalable systems, and user experience. Currently exploring Web3 and AI."}
          </BlurTextReveal>
        </div>

        {/* Bento grid: Routine + Stats */}
        <CenterBurstStagger className="grid grid-cols-1 md:grid-cols-3 gap-4" staggerDelay={0.06}>
          {/* Routine card — spans 2 cols */}
          <CenterBurstItem className="md:col-span-2">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 h-full rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-colors duration-500"
            >
              <p className="text-xs font-mono text-muted-foreground/60 mb-6 uppercase tracking-wider">
                Daily Loop
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                {routine.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-2xl border border-border/30 flex items-center justify-center bg-background/50 group-hover:bg-accent/30 transition-colors group/icon">
                        <item.icon className={`w-5 h-5 ${item.color} opacity-70 group-hover/icon:opacity-100 transition-opacity`} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{item.label}</span>
                    </motion.div>
                    {i < routine.length - 1 && (
                      <span className="text-muted-foreground/20 text-xs mb-6">→</span>
                    )}
                  </div>
                ))}
                <div className="mb-6">
                  <span className="text-muted-foreground/20 text-xs">↺</span>
                </div>
              </div>
            </motion.div>
          </CenterBurstItem>

          {/* Goal card */}
          <CenterBurstItem>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 h-full rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm flex flex-col justify-between group hover:border-primary/50 transition-colors duration-500"
            >
              <div>
                <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                  Goal
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <p className="text-2xl font-roashe leading-tight">
                    Scale to the
                    <br />
                    <span className="text-primary italic">Cloud</span> ☁️
                  </p>
                </div>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground/40 mt-4 uppercase tracking-[0.2em]">
                Current Mission
              </p>
            </motion.div>
          </CenterBurstItem>
        </CenterBurstStagger>

        {/* Stats row */}
        <CenterBurstStagger className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4" staggerDelay={0.06}>
          {stats.map((stat) => (
            <CenterBurstItem key={stat.label}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-5 h-full rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm text-center group hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="text-3xl font-roashe group-hover:text-primary transition-colors"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-2">{stat.label}</p>
                </div>
              </motion.div>
            </CenterBurstItem>
          ))}
        </CenterBurstStagger>

        {children}
      </div>
    </section>
  );
}
