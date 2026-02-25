"use client";

import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { ReactNode, useRef, useState, useEffect } from "react";

interface InfiniteMarqueeProps {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: number; // pixels per second
  className?: string;
  pauseOnHover?: boolean;
}

export function InfiniteMarquee({
  children,
  direction = "left",
  speed = 50,
  className = "",
  pauseOnHover = true,
}: InfiniteMarqueeProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      // contentRef contains 3 copies of children
      setContentWidth(contentRef.current.scrollWidth / 3);
    }
  }, [children]);

  useAnimationFrame((t, delta) => {
    if (contentWidth === 0 || (pauseOnHover && isHovered)) return;

    const moveBy = (speed * delta) / 1000;
    let newValue = x.get() + (direction === "left" ? -moveBy : moveBy);

    // Loop logic
    if (direction === "left") {
      if (newValue <= -contentWidth) {
        newValue += contentWidth;
      }
    } else {
      if (newValue >= 0) {
        newValue -= contentWidth;
      }
    }

    x.set(newValue);
  });

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={contentRef}
        style={{ x }}
        className="inline-flex gap-8"
      >
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}
