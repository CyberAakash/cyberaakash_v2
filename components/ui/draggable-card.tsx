import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
} from "framer-motion";

export const DraggableCardBody = ({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Use lower stiffness/damping for "liquid" responsiveness
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);

  const rotateX = useTransform(mouseY, [-100, 100], [15, -15]);
  const rotateY = useTransform(mouseX, [-100, 100], [-15, 15]);

  const [constraints, setConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });

  useEffect(() => {
    const updateConstraints = () => {
      if (typeof window !== "undefined" && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        // Constraints relative to the initial position to allow global movement
        // We set very large constraints so it can go anywhere in the viewport
        setConstraints({
          top: -rect.top,
          left: -rect.left,
          right: window.innerWidth - rect.right,
          bottom: window.innerHeight - rect.bottom,
        });
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      dragElastic={0.05} // Low elasticity for performant "hits"
      dragMomentum={true}
      onDragStart={() => {
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = "default";
        
        // Single bounce simulation on velocity release
        const vX = velocityX.get();
        const vY = velocityY.get();
        
        animate(x, x.get() + vX * 0.1, {
          type: "spring",
          stiffness: 100,
          damping: 25,
          mass: 0.5,
          velocity: vX
        });
        
        animate(y, y.get() + vY * 0.1, {
          type: "spring",
          stiffness: 100,
          damping: 25,
          mass: 0.5,
          velocity: vY
        });
      }}
      style={{
        ...style,
        x,
        y,
        rotateX,
        rotateY,
        willChange: "transform",
      }}
      whileHover={{ scale: 1.05, zIndex: 100 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-card border border-border/50 shadow-2xl transition-shadow cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {children}
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("[perspective:2000px]", className)}>{children}</div>
  );
};
