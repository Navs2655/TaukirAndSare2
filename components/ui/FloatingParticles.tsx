"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedEffects } from "@/hooks/useReducedEffects";

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
}

export default function FloatingParticles({ count = 18 }: { count?: number }) {
  const reduced = useReducedEffects();
  const effectiveCount = reduced ? Math.ceil(count / 2) : count;

  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: effectiveCount }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 10 + 12,
        delay: Math.random() * 8,
      })),
    [effectiveCount]
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none motion-reduce:hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "-10%", opacity: [0, 0.6, 0.6, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 rounded-full bg-gold"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}
