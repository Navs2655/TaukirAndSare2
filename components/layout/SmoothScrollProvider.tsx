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

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback(
    (target: string | HTMLElement, options?: { duration?: number; offset?: number }) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.4,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          ...options,
        });
      } else {
        // Reduced motion, or Lenis hasn't initialized yet — plain fallback
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
