"use client";

import { createContext, useContext } from "react";

interface LenisScrollOptions {
  duration?: number;
  offset?: number;
}

interface LenisContextValue {
  scrollTo: (target: string | HTMLElement, options?: LenisScrollOptions) => void;
}

// Fallback (used before Lenis initializes, or if reduced-motion skipped it)
export const LenisContext = createContext<LenisContextValue>({
  scrollTo: (target) => {
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  },
});

export function useLenisScroll() {
  return useContext(LenisContext);
}
