"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function SparkBurst({
  count = 14,
  minDistance = 70,
  maxDistanceAdd = 50,
}: {
  count?: number;
  minDistance?: number;
  maxDistanceAdd?: number;
}) {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const distance = minDistance + Math.random() * maxDistanceAdd;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: Math.random() * 3 + 1.5,
          delay: Math.random() * 0.15,
        };
      }),
    [count, minDistance, maxDistanceAdd]
  );

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute top-1/2 left-1/2 rounded-full bg-gold"
          style={{ width: s.size, height: s.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.4 }}
          transition={{ duration: 1.1, delay: s.delay, ease: EASE }}
        />
      ))}
    </div>
  );
}
