"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate as animateValue,
} from "framer-motion";
import GeometricStar from "@/components/ui/GeometricStar";
import SparkBurst from "@/components/ui/SparkBurst";
import { vibrate } from "@/utils/vibrate";

const EASE = [0.16, 1, 0.3, 1] as const;
const DRAG_MAX = 90;
const DRAG_THRESHOLD = 52;

export default function DateReveal() {
  // `revealed` is the single source of truth for whether the date is shown.
  // The date's own visibility is driven purely by this boolean via a plain
  // CSS opacity transition below — deliberately NOT tied to any Framer
  // Motion value shared with the seal's drag/crack visuals, so a glitch or
  // interruption in the decorative seal animation can never leave the date
  // hidden. The seal is cosmetic; `revealed` is the only thing that matters.
  const [revealed, setRevealed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const dragX = useMotionValue(0);
  const dragProgress = useTransform(dragX, [0, DRAG_MAX], [0, 1]);
  const starOpacity = useTransform(dragProgress, [0, 1], [1, 0.2]);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const completeReveal = () => {
    setRevealed((prev) => {
      if (prev) return prev; // idempotent — safe against repeated triggers
      setBurstKey((k) => k + 1);
      vibrate(40);
      return true;
    });
    // Seal's own visual snap-open — purely decorative, doesn't gate the date
    animateValue(dragX, DRAG_MAX * 1.6, {
      type: "spring",
      stiffness: 200,
      damping: 22,
    });
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    // Checks both the reported offset and the motion value's own resting
    // position — belt-and-braces against any discrepancy between the two
    // on fast or interrupted gestures.
    const crossedThreshold =
      info.offset.x > DRAG_THRESHOLD || dragX.get() > DRAG_THRESHOLD * 0.85;

    if (crossedThreshold) {
      completeReveal();
    } else {
      animateValue(dragX, 0, { type: "spring", stiffness: 320, damping: 26 });
    }
  };

  return (
    <section
      id="date-reveal"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,162,79,0.1) 0%, rgba(9,9,9,0) 70%)",
        }}
      />

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 font-body text-gold text-xs tracking-luxury uppercase mb-4"
      >
        A Blessed Date Awaits
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-10 font-heading text-3xl md:text-4xl text-champagne/90 mb-16 text-center"
      >
        Break the Seal to Reveal It
      </motion.h2>

      <div className="relative z-10 flex flex-col items-center">
        <div
          role="button"
          tabIndex={0}
          onClick={completeReveal}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              completeReveal();
            }
          }}
          aria-label={
            revealed
              ? "Wedding date revealed: 10th November 2026"
              : "Drag the seal open, or press Enter, to reveal the wedding date"
          }
          className="relative w-40 h-40 md:w-52 md:h-52 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-8 rounded-full cursor-pointer"
        >
          {/* GUARANTEED date layer — always mounted, plain CSS opacity
              transition driven only by `revealed`. This is the fallback
              that cannot fail: no motion values, no animation library
              state, nothing that can race or get interrupted. */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
              revealed ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="font-heading text-2xl md:text-3xl text-gradient-gold whitespace-nowrap">
              10th Nov
            </span>
            <span className="font-body text-champagne/60 text-xs tracking-luxury uppercase mt-1">
              2026
            </span>
          </div>

          {/* Live drag preview — decorative only, pre-reveal, sits below
              the guaranteed layer and is superseded by it once revealed */}
          {!revealed && (
            <motion.div
              style={{ opacity: dragProgress }}
              className="absolute inset-0 flex flex-col items-center justify-center"
              aria-hidden="true"
            >
              <span className="font-heading text-2xl md:text-3xl text-gradient-gold whitespace-nowrap">
                10th Nov
              </span>
              <span className="font-body text-champagne/60 text-xs tracking-luxury uppercase mt-1">
                2026
              </span>
            </motion.div>
          )}

          {/* Spark burst, one-shot — skipped for reduced motion */}
          {revealed && !reducedMotion && (
            <div key={burstKey} className="absolute inset-0 pointer-events-none">
              <SparkBurst />
            </div>
          )}

          {/* Left half — static */}
          <div className="absolute inset-0 overflow-hidden rounded-l-full pointer-events-none">
            <motion.div
              animate={
                revealed
                  ? { x: "-55%", rotate: -12, opacity: 0 }
                  : { x: "0%", rotate: 0, opacity: 1 }
              }
              transition={{ duration: 0.7, ease: EASE }}
              className="absolute inset-0 w-[200%]"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(200,162,79,0.15) 0%, rgba(9,9,9,0.4) 70%)",
                border: "1px solid rgba(200,162,79,0.4)",
                borderRadius: "9999px",
              }}
            />
          </div>

          {/* Right half — the draggable "peel" */}
          <div className="absolute inset-0 overflow-visible rounded-r-full">
            <motion.div
              drag={revealed ? false : "x"}
              dragConstraints={{ left: 0, right: DRAG_MAX }}
              dragElastic={0.12}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
              animate={revealed ? { rotate: 14, opacity: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-0 -left-full w-[200%] active:cursor-grabbing"
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 70% 30%, rgba(200,162,79,0.15) 0%, rgba(9,9,9,0.4) 70%)",
                  border: "1px solid rgba(200,162,79,0.4)",
                  borderRadius: "9999px",
                }}
              />
              {!revealed && (
                <span className="absolute top-1/2 -translate-y-1/2 right-[calc(50%-2px)] w-1 h-6 rounded-full bg-gold/40" />
              )}
            </motion.div>
          </div>

          {/* Whole star motif, centered — fades out as the halves part */}
          <motion.div
            animate={revealed ? { opacity: 0, scale: 1.15 } : { scale: 1 }}
            style={{ opacity: revealed ? undefined : starOpacity }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-24 h-24 md:w-32 md:h-32">
              <GeometricStar className="w-full h-full" />
            </div>
          </motion.div>

          {/* Ambient pulse while unrevealed — skipped for reduced motion */}
          {!revealed && !reducedMotion && (
            <motion.span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(200,162,79,0.2) 0%, rgba(200,162,79,0) 70%)",
              }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-champagne/40 text-xs tracking-luxury uppercase mt-8"
        >
          {revealed ? "The date is set" : "Drag or Tap to Reveal"}
        </motion.p>
      </div>
    </section>
  );
}
