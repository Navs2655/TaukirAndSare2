"use client";

import { useReducedEffects } from "@/hooks/useReducedEffects";

export default function FilmGrain() {
  const reduced = useReducedEffects();
  if (reduced) return null; // skip this purely decorative layer on slow connections

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 opacity-[0.04] animate-grain"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }}
      aria-hidden="true"
    />
  );
}
