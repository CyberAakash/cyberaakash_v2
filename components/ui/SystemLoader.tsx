"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SystemLoaderProps {
  onComplete: () => void;
}

export default function SystemLoader({ onComplete }: SystemLoaderProps) {
  const [stage, setStage] = useState<"loading" | "popup" | "accepted">("loading");
  const [progress, setProgress] = useState(0);
  const [currentRank, setCurrentRank] = useState("E");
  const [autoClickTimer, setAutoClickTimer] = useState(5);
  const ranks = ["E", "D", "C", "B", "A", "S"];

  useEffect(() => {
    if (stage === "loading") {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setStage("popup");
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      const rankTimer = setInterval(() => {
        setCurrentRank((prev) => {
          const nextIdx = ranks.indexOf(prev) + 1;
          return nextIdx < ranks.length ? ranks[nextIdx] : "S";
        });
      }, 400);

      return () => {
        clearInterval(timer);
        clearInterval(rankTimer);
      };
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "popup") {
      const timer = setInterval(() => {
        setAutoClickTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAccept();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  const handleAccept = () => {
    setStage("accepted");
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black font-mono overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <motion.div
            key="loading-stage"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            className="relative z-10 w-full max-w-lg px-6"
          >
            <div className="border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xl p-8 rounded-sm relative">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-500/70 font-bold">System Loading...</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-cyan-400">RANK {currentRank}</span>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-xl font-bold text-white tracking-widest uppercase italic">Synchronizing...</h1>
                <div className="h-1.5 w-full bg-white/5 border border-cyan-500/10 p-[1px]">
                  <motion.div
                    className="h-full bg-cyan-400 shadow-[0_0_15px_#06b6d4]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-cyan-500/50 font-bold tracking-widest uppercase">
                  <span>{progress}%</span>
                  <span className="animate-pulse">ESTABLISHING_LINK...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stage === "popup" && (
          <motion.div
            key="popup-stage"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: [0, -2, 2, -2, 2, 0] 
            }}
            transition={{ duration: 0.4 }}
            className="relative z-20 w-full max-w-md px-6"
          >
            <div className="border-2 border-cyan-400 bg-cyan-950/95 shadow-[0_0_60px_rgba(6,182,212,0.5)] p-0 rounded-none relative overflow-hidden">
              {/* Header Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 animate-pulse" />
              
              <div className="p-8 space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-block px-4 py-1 border border-cyan-500/50 text-[10px] text-cyan-400 uppercase tracking-[0.5em] font-black">System Notification</div>
                  <h2 className="text-2xl font-black text-white tracking-tighter leading-tight italic">
                    YOU HAVE ACQUIRED THE STATUS TO BE A <span className="text-cyan-400 glow-cyan">PLAYER</span>.
                  </h2>
                </div>

                <div className="text-center">
                  <p className="text-xs text-cyan-300/80 font-bold uppercase tracking-[0.2em] mb-8">
                    Will you accept the awakening?
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleAccept}
                      className="group relative overflow-hidden px-8 py-5 bg-cyan-500 text-black font-black uppercase text-sm tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95"
                    >
                      YES
                      <motion.div 
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-black/30"
                      />
                      <div className="absolute top-1 right-2 text-[8px] opacity-40">[{autoClickTimer}S]</div>
                    </button>
                    <button className="px-8 py-5 border border-cyan-500/20 text-cyan-500/20 font-black uppercase text-sm tracking-widest cursor-not-allowed">
                      NO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stage === "accepted" && (
          <motion.div
            key="accepted-stage"
            className="relative z-30 flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1.5, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-40 h-px bg-cyan-400 shadow-[0_0_20px_#06b6d4]"
            />
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              animate={{ 
                scale: [1, 1.1, 1], 
                opacity: [0, 1, 0],
                filter: ["blur(10px)", "blur(0px)", "blur(20px)"]
              }}
              transition={{ duration: 1.2 }}
              className="text-7xl md:text-9xl font-black text-cyan-400 italic tracking-[0.4em] glow-cyan"
            >
              ARISE
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1.5, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-40 h-px bg-cyan-400 shadow-[0_0_20px_#06b6d4]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .glow-cyan {
          text-shadow: 0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4);
        }
      `}</style>

      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-[5]">
        <div className="w-full h-px bg-cyan-500/30 absolute animate-scanline top-0" />
      </div>
    </div>
  );
}
