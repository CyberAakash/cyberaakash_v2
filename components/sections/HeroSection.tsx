"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@/lib/spline-wrapper"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />,
});

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Spline 3D background — pointer-events-none so page can scroll */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Spline
          scene="https://prod.spline.design/2iQaJ8VtqLe8zZPf/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/40 via-transparent to-background pointer-events-none" />

      {/* Scroll indicator only */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-muted-foreground/50"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </section>
  );
}
