"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
}

export default function ShimmerText({
  children,
  className,
  shimmerColor = "white",
}: ShimmerTextProps) {
  return (
    <span className={cn("relative inline-block overflow-hidden", className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
          repeatDelay: 2,
        }}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}20, ${shimmerColor}60, ${shimmerColor}20, transparent)`,
          transform: "skewX(-20deg)",
        }}
      />
    </span>
  );
}
