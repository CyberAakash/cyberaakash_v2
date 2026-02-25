"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MeshGradientProps {
  colors?: string[];
  className?: string;
  speed?: number;
}

export default function MeshGradient({
  colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
  className,
  speed = 10,
}: MeshGradientProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none opacity-20", className)}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full blur-[100px]"
        style={{ backgroundColor: colors[0] }}
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -40, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: speed * 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full blur-[100px]"
        style={{ backgroundColor: colors[1] || colors[0] }}
      />
      {colors[2] && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -60, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: speed * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full blur-[80px]"
          style={{ backgroundColor: colors[2] }}
        />
      )}
    </div>
  );
}
