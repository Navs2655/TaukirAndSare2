"use client";

import { createContext, useContext } from "react";

interface LenisContextValue {
  scrollTo: (target: string | HTMLElement, options?: { duration?: number; offset?: number }) => void;
}

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
