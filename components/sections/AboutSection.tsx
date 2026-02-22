"use client";

import type { About } from "@/lib/types";
import BlurTextReveal from "@/components/animations/BlurTextReveal";
import ScrollTextReveal from "@/components/animations/ScrollTextReveal";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Code, Gamepad2, Dumbbell, BookOpen, Brain, Moon } from "lucide-react";

interface AboutSectionProps {
  about: About | null;
}

const routine = [
  { icon: Code, label: "code" },
  { icon: Gamepad2, label: "play" },
  { icon: Dumbbell, label: "gym" },
  { icon: BookOpen, label: "learn" },
  { icon: Brain, label: "think" },
  { icon: Moon, label: "sleep" },
];

const stats = [
  { label: "Projects Built", value: "15+" },
  { label: "Technologies", value: "20+" },
  { label: "Years Coding", value: "3+" },
  { label: "Cups of Coffee", value: "∞" },
];

export default function AboutSection({ about }: AboutSectionProps) {
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
          <CenterBurstItem className="md:col-span-2 p-6 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm">
            <p className="text-xs font-mono text-muted-foreground/60 mb-4 uppercase tracking-wider">
              Daily Loop
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {routine.map((item, i) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl border border-border/30 flex items-center justify-center hover:bg-accent/50 transition-colors group cursor-default">
                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{item.label}</span>
                  {i < routine.length - 1 && (
                    <span className="text-muted-foreground/30 text-xs">→</span>
                  )}
                </div>
              ))}
              <span className="text-muted-foreground/30 text-xs">↺</span>
            </div>
          </CenterBurstItem>

          {/* Goal card */}
          <CenterBurstItem className="p-6 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm flex flex-col justify-between">
            <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
              Goal
            </p>
            <p className="text-xl font-roashe mt-3">
              Become an
              <br />
              Entrepreneur 🚀
            </p>
          </CenterBurstItem>
        </CenterBurstStagger>

        {/* Stats row */}
        <CenterBurstStagger className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4" staggerDelay={0.06}>
          {stats.map((stat) => (
            <CenterBurstItem
              key={stat.label}
              className="p-5 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm text-center"
            >
              <p className="text-2xl font-roashe">{stat.value}</p>
              <p className="text-xs font-mono text-muted-foreground mt-1">{stat.label}</p>
            </CenterBurstItem>
          ))}
        </CenterBurstStagger>
      </div>
    </section>
  );
}
