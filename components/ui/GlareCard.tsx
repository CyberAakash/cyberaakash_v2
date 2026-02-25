"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import MeshGradient from "./mesh-gradient";

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  showMesh?: boolean;
}

export default function GlareCard({ children, className, colors, showMesh = false }: GlareCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out mouse movements (slower and more fluid)
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 40 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 40 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  const glareOpacity = useTransform(smoothX, [0, 100], [0, 1], { clamp: false });
  
  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-2xl border border-white/5 bg-transparent backdrop-blur-xl overflow-hidden group transition-all duration-500",
        className
      )}
    >
      {/* Dynamic Mesh Blobs */}
      {showMesh && (
        <MeshGradient 
          colors={colors} 
          className="opacity-20 mix-blend-soft-light scale-150 animate-slow-drift" 
        />
      )}

      {/* Mouse-tracked Glare Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: useTransform(
            [smoothX, smoothY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 80%)`
          ),
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full">
        {children}
      </div>

      <style jsx global>{`
        @keyframes slow-drift {
          0% { transform: translate(0, 0) scale(1.5); }
          33% { transform: translate(2%, 3%) scale(1.6); }
          66% { transform: translate(-2%, 2%) scale(1.5); }
          100% { transform: translate(0, 0) scale(1.5); }
        }
        .animate-slow-drift {
          animation: slow-drift 15s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  );
}
