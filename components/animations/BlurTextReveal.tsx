"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BlurTextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export default function BlurTextReveal({
  children,
  className = "",
  delay = 0,
}: BlurTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const words = children.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={
            inView
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(8px)" }
          }
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: "easeOut",
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
