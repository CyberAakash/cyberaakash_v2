"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
      <div className="relative flex flex-col items-center gap-4">
        {/* System Eye/Core */}
        <motion.div
           className="w-16 h-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
           animate={{ 
             scaleX: [0, 1, 0.5, 1],
             opacity: [0.5, 1, 0.5]
           }}
           transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-cyan-400">
            System Transition...
          </span>
        </div>
      </div>
    </div>
  );
}
