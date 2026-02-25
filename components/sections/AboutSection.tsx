"use client";

import type { About } from "@/lib/types";
import { useState } from "react";
import BlurTextReveal from "@/components/animations/BlurTextReveal";
import ScrollTextReveal from "@/components/animations/ScrollTextReveal";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Code, Gamepad2, Dumbbell, BookOpen, Brain, Moon, Sparkles, Anchor, Swords, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MeshGradient from "@/components/ui/mesh-gradient";
import ShimmerText from "@/components/animations/ShimmerText";

interface AboutSectionProps {
  about: About | null;
  stats: {
    projects: string;
    tech: string;
    years: string;
    coffee: string;
  };
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

import GlareCard from "@/components/ui/GlareCard";

export default function AboutSection({ about, stats, children }: AboutSectionProps) {
  const words = ["products", "systems", "experiences", "solutions"];

  const bentoStats = [
    { label: "Projects Built", value: stats?.projects || "0", colors: ["#3b82f6", "#1d4ed8", "#3b82f6"] },
    { label: "Technologies", value: stats?.tech || "0", colors: ["#06b6d4", "#0891b2", "#06b6d4"] },
    { label: "Years Coding", value: stats?.years || "0", colors: ["#ec4899", "#be185d", "#ec4899"] },
    { label: "Cups of Coffee", value: stats?.coffee || "0", colors: ["#f59e0b", "#d97706", "#f59e0b"] },
  ];


  const [questOpen, setQuestOpen] = useState(false);
  const [questItems, setQuestItems] = useState([
    { id: "pushups", label: "Push-ups", current: 0, target: 100, unit: "" },
    { id: "situps", label: "Sit-ups", current: 0, target: 100, unit: "" },
    { id: "squats", label: "Squats", current: 0, target: 100, unit: "" },
    { id: "running", label: "Running", current: 0.0, target: 10.0, unit: "km" },
  ]);

  const toggleItem = (id: string) => {
    setQuestItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, current: item.current === item.target ? 0 : item.target };
      }
      return item;
    }));
  };

  const totalProgress = (questItems.filter(i => i.current === i.target).length / questItems.length) * 100;
  const isComplete = totalProgress === 100;

  return (
    <section id="about" className="section-padding min-h-screen flex flex-col justify-center relative bg-black overflow-hidden">
      {/* Solo Leveling Quest Overlay */}
      <AnimatePresence>
        {questOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full border font-mono border-cyan-500/20 bg-[#020617]/95 shadow-[0_0_80px_rgba(6,182,212,0.15)] rounded-3xl overflow-hidden p-8 relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setQuestOpen(false)}
                className="absolute top-6 right-6 text-cyan-400/30 hover:text-cyan-400 transition-colors z-50 p-2"
              >
                <X className="w-5 h-5" /> 
              </button>

              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 border border-cyan-500/30 rounded-lg">
                    <Swords className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="px-6 py-2 border border-cyan-500/30 rounded-sm">
                    <span className="text-xl font-roashe tracking-[0.2em] text-cyan-200">QUEST INFO</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-cyan-300/80 text-xs italic">[Daily Quest: <span className="text-white font-bold tracking-wider">Strange Training has Arrived.</span>]</p>
                </div>

                <div className="w-full text-center border-b border-cyan-500/20 pb-4 relative">
                   <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                  <h4 className="text-4xl font-roashe text-cyan-100 tracking-[0.2em]">GOAL</h4>
                </div>

                <div className="w-full space-y-4 px-2">
                  {questItems.map((item) => {
                    const done = item.current === item.target;
                    return (
                      <button 
                        key={item.id} 
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group/quest-btn ${
                          done 
                            ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                            : 'bg-white/5 border-white/5 hover:border-cyan-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                            done ? 'bg-cyan-500 border-cyan-500' : 'border-cyan-500/30'
                          }`}>
                            {done && <Sparkles className="w-3 h-3 text-black" />}
                          </div>
                          <span className={`text-sm transition-colors ${done ? 'text-cyan-200 font-bold' : 'text-neutral-400'}`}>
                            {item.label}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono transition-colors ${done ? 'text-cyan-400' : 'text-neutral-600'}`}>
                          [{item.current} / {item.target}{item.unit}]
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="w-full space-y-2">
                   <div className="flex justify-between text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest px-1">
                      <span>Sync Progress</span>
                      <span>{Math.round(totalProgress)}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        animate={{ width: `${totalProgress}%` }}
                        className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                      />
                   </div>
                </div>

                <div className="pt-4 border-t border-cyan-500/20 w-full text-center">
                  <p className="text-[9px] text-cyan-400/60 leading-relaxed uppercase tracking-tighter max-w-xs mx-auto">
                    WARNING: Failure to complete the daily quest will result in an appropriate penalty.
                  </p>
                </div>
                
                <button 
                  onClick={() => isComplete && setQuestOpen(false)}
                  disabled={!isComplete}
                  className={`w-full py-4 font-bold uppercase tracking-[0.3em] text-[10px] transition-all rounded-xl border ${
                    isComplete 
                      ? 'bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
                      : 'bg-white/5 text-neutral-600 border-white/10 cursor-not-allowed'
                  }`}
                >
                  {isComplete ? "Receive Rewards" : "Quest Incomplete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <CenterBurstStagger className="flex flex-col gap-12" staggerDelay={0.1}>
          {/* ... */}
        {/* I'll use surgical edits instead */}
        {/* ... rest of existing code ... */}
        {/* I'll need to use the full content for the section to avoid line drift or just use a smaller chunk if I'm careful */}
        {/* Refactoring the Solo Leveling card part below */}
        {/* Section label */}
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-8 text-center md:text-left">
            // about
          </p>
        </CenterBurst>

        {/* Name + FlipWords */}
        <CenterBurst delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-roashe tracking-tight mb-4 text-center md:text-left">
            <ShimmerText shimmerColor="#3b82f6">{about?.name || "Aakash T"}</ShimmerText>
          </h2>
        </CenterBurst>

        <CenterBurst delay={0.15}>
          <div className="text-xl sm:text-2xl text-muted-foreground mb-8 text-center md:text-left">
            I build <FlipWords words={words} className="text-foreground font-medium" />
          </div>
        </CenterBurst>

        {/* Bio with blur text reveal */}
        <div className="max-w-2xl mb-16 mx-auto md:mx-0">
          <BlurTextReveal className="text-base sm:text-lg text-muted-foreground leading-relaxed text-center md:text-left">
            {about?.bio || "Full Stack Developer at Zoho. I build things that live on the internet. My daily loop: code → play → gym → learn → think → sleep. On a mission to build something of my own — entrepreneur in the making."}
          </BlurTextReveal>
        </div>

        {/* Bento grid: Routine + Stats + Anime */}
        <div className="relative group/grid">
          {/* Subtle accent glow behind the grid */}
          <div className="absolute -inset-20 pointer-events-none z-0 opacity-40">
            <MeshGradient 
              colors={["#3b82f6", "#8b5cf6"]} 
              className="blur-[140px] opacity-20 scale-110 animate-slow-drift" 
            />
          </div>

          <CenterBurstStagger className="relative z-10 grid grid-cols-1 md:grid-cols-6 gap-4" staggerDelay={0.06}>
          {/* Routine card — spans 4 cols */}
          <CenterBurstItem className="md:col-span-4 h-full">
            <GlareCard className="p-6 h-full border-white/5">
              <p className="relative z-10 text-xs font-mono text-muted-foreground/60 mb-6 uppercase tracking-wider">
                Daily Loop
              </p>
              <div className="relative z-10 flex items-center gap-4 flex-wrap">
                {routine.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors group/icon">
                        <item.icon className={`w-5 h-5 ${item.color} opacity-70 group-hover/icon:opacity-100 transition-opacity`} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{item.label}</span>
                    </motion.div>
                    {i < routine.length - 1 && (
                      <span className="text-white/10 text-xs mb-6">→</span>
                    )}
                  </div>
                ))}
                <div className="mb-6">
                  <span className="text-white/10 text-xs">↺</span>
                </div>
              </div>
            </GlareCard>
          </CenterBurstItem>

          {/* Goal card - spans 2 cols */}
          <CenterBurstItem className="md:col-span-2">
            <GlareCard className="p-6 h-full flex flex-col justify-between border-white/5">
              <div>
                <p className="relative z-10 text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                  Goal
                </p>
                <div className="relative z-10 mt-4 flex items-center gap-3">
                  <p className="text-2xl font-roashe leading-tight">
                    Scale to the
                    <br />
                    <span className="text-primary italic">Cloud</span> ☁️
                  </p>
                </div>
              </div>
              <p className="relative z-10 text-[10px] font-mono text-muted-foreground/40 mt-4 uppercase tracking-[0.2em]">
                Current Mission
              </p>
            </GlareCard>
          </CenterBurstItem>

          {/* New Personality Card: Solo Leveling "System" */}
          <CenterBurstItem className="md:col-span-3">
            <GlareCard
              showMesh
              colors={["#06b6d4", "#0e7490", "#0891b2"]}
              className="p-0 min-h-64 h-auto flex flex-col justify-between border-cyan-500/30 bg-cyan-950/20 group/solo overflow-hidden will-change-transform"
            >
              {/* Sharp Edge Accents */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              
              <div className="relative z-10 p-5 h-full flex flex-col">
                {/* Header: System Message */}
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.4em]">Status Window</p>
                    </div>
                    <h3 className="text-xl font-roashe text-foreground tracking-tight">Shadow Monarch</h3>
                  </div>
                  <button 
                    onClick={() => setQuestOpen(true)}
                    className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/40 transition-all relative group/battle overflow-visible"
                  >
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.4, 1], 
                        opacity: [0.3, 0, 0.3],
                        boxShadow: ["0 0 0px #06b6d4", "0 0 20px #06b6d4", "0 0 0px #06b6d4"]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-lg bg-cyan-500/20 pointer-events-none"
                    />
                    <Swords className="w-4 h-4 text-cyan-400 relative z-10" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  {/* Left Column: Vitality Bars */}
                  <div className="space-y-3 justify-center flex flex-col">
                    {[
                      { label: "HP", current: 100, max: 100, color: "bg-red-500", glow: "shadow-[0_0_10px_rgba(239,68,68,0.5)]" },
                      { label: "MP", current: 88420, max: 100000, color: "bg-cyan-500", glow: "shadow-[0_0_10px_rgba(6,182,212,0.5)]" },
                      { label: "FATIGUE", current: 0, max: 100, color: "bg-yellow-500", glow: "shadow-[0_0_10px_rgba(234,179,8,0.5)]" }
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-1">
                        <div className="flex justify-between text-[8px] font-mono text-foreground/60 uppercase tracking-widest">
                          <span>{stat.label}</span>
                          <span className="text-foreground/80">{stat.current} / {stat.max}</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(stat.current / stat.max) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            className={`h-full ${stat.color} ${stat.glow}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col justify-center gap-2 pl-4 border-l border-white/5">
                    {/* Stats hidden as per user request */}
                  </div>
                </div>

                {/* Footer: Notification */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
                  <div 
                    role="button" 
                    onClick={() => setQuestOpen(true)}
                    className="flex items-center gap-2 cursor-pointer group/arise"
                  >
                    <div className="px-1.5 py-0.5 rounded bg-cyan-500 text-[7px] font-bold text-black uppercase tracking-tighter group-active/arise:scale-95 transition-transform">New</div>
                    <p className="text-[9px] font-mono text-cyan-300/80 uppercase tracking-widest animate-pulse group-hover/arise:text-cyan-400">Level Up Imminent...</p>
                  </div>
                  <p className="text-[9px] font-mono text-foreground/40">LVL: 99</p>
                </div>
              </div>
            </GlareCard>
          </CenterBurstItem>

          {/* New Personality Card: One Piece "Grand Line" */}
          <CenterBurstItem className="md:col-span-3">
            <GlareCard
              showMesh={false}
              className="p-0 min-h-64 h-full border-orange-500/20 bg-orange-950/40 will-change-transform group/one"
            >
              <img 
                src="/assets/anime/one-piece.webp" 
                alt="One Piece Adventure"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/one:opacity-100 transition-all duration-700 group-hover/one:scale-110 z-0"
              />
              <div className="absolute inset-0 bg-black/40 group-hover/one:bg-black/20 transition-colors duration-700 z-[1]" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-[2]">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-orange-400 uppercase tracking-[0.3em]">Adventure Log</p>
                    <h3 className="text-xl font-roashe text-foreground">The Grand Line</h3>
                  </div>
                  <Anchor className="w-5 h-5 text-orange-400/40" />
                </div>

                <div className="mt-auto space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Chasing horizons and building dreams. One day at a time.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {["Gomu Gomu", "Adventure", "Haki"].map(tag => (
                      <span key={tag} className="text-[8px] font-mono border border-orange-500/30 px-2 py-0.5 rounded-md text-orange-400 bg-orange-500/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlareCard>
          </CenterBurstItem>

          {/* Stats Row */}
          <div className="md:col-span-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {bentoStats.map((stat, i) => (
              <CenterBurstItem key={stat.label}>
                <GlareCard className="p-5 h-full text-center border-white/5">
                  <div className="relative z-10 flex flex-col items-center">
                    <p className="text-3xl font-bold font-sans tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-2">{stat.label}</p>
                  </div>
                </GlareCard>
              </CenterBurstItem>
            ))}
          </div>
            </CenterBurstStagger>
          </div>
        </CenterBurstStagger>

        {children}
      </div>
    </section>
  );
}
