"use client";

import { useEffect, useRef, useCallback, ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import { LenisContext } from "@/components/layout/LenisContext";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Switched from a fixed duration+easing config (meant for one-off
    // programmatic scrolls) to lerp-based continuous smoothing — the
    // duration+easing approach was being replayed on every wheel/touch
    // input, which feels heavier and less responsive than a real-time
    // lerp follow. This is the likely cause of general scroll lag.
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback(
    (target: string | HTMLElement, options?: { duration?: number; offset?: number }) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.2,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          ...options,
        });
      } else {
        const el =
          typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <LenisContext.Provider value={{ scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
