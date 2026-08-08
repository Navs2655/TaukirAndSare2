"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const minTime = prefersReducedMotion ? 300 : 1400;
    const start = Date.now();

    const finish = () => {
      const remaining = Math.max(0, minTime - (Date.now() - start));
      setTimeout(() => setLoading(false), remaining);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(finish).catch(finish);
    } else {
      finish();
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-heading text-2xl text-gradient-gold tracking-luxury mb-6"
          >
            T&nbsp;&amp;&nbsp;S
          </motion.span>
          <div className="w-32 h-px bg-gold/15 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: EASE }}
              className="h-full bg-gold origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
