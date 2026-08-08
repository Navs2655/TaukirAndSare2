"use client";

import { useId } from "react";
import { motion } from "framer-motion";

export default function CrescentMoon() {
  // Unique ids per instance — prevents duplicate SVG def IDs when this
  // component renders more than once on the page (Hero + Closing), which
  // caused incorrect mask rendering on some Android browsers (Samsung Internet).
  const uid = useId();
  const gradientId = `moonGradient-${uid}`;
  const maskId = `crescentMask-${uid}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-24 h-24 md:w-32 md:h-32"
      aria-hidden="true"
    >
      {/* Halo glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(200,162,79,0.35) 0%, rgba(200,162,79,0) 70%)",
          transform: "scale(2.2)",
        }}
      />
      <svg viewBox="0 0 100 100" className="relative w-full h-full">
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F7F3EA" />
            <stop offset="100%" stopColor="#C8A24F" />
          </radialGradient>
          <mask id={maskId} maskUnits="objectBoundingBox">
            <rect width="100" height="100" fill="white" />
            <circle cx="62" cy="42" r="34" fill="black" />
          </mask>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="38"
          fill={`url(#${gradientId})`}
          mask={`url(#${maskId})`}
        />
      </svg>
    </motion.div>
  );
}
