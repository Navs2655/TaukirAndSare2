"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
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
  const [revealed, setRevealed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Drag position of the seal's right half — the "peel it open" gesture.
  // Live-linked to the date's opacity so guests get real-time feedback as
  // they drag, not just a binary before/after state.
  const dragX = useMotionValue(0);
  const dragProgress = useTransform(dragX, [0, DRAG_MAX], [0, 1]);
  const starOpacity = useTransform(dragProgress, [0, 1], [1, 0.2]);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const completeReveal = () => {
    if (revealed) return;
    setRevealed(true);
    setBurstKey((k) => k + 1);
    vibrate(40); // light tactile tick on Android when the seal fully cracks
    animateValue(dragX, DRAG_MAX * 1.6, {
      type: "spring",
      stiffness: 200,
      damping: 22,
    });
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number } }
  ) => {
    if (info.offset.x > DRAG_THRESHOLD) {
      completeReveal();
    } else {
      // Didn't drag far enough — seal springs back closed
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
          {/* Revealed date — sits behind the seal, tracks drag progress live */}
          <motion.div
            style={{ opacity: revealed ? undefined : dragProgress }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <AnimatePresence>
              {revealed && (
                <motion.div
                  key={`date-${burstKey}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                  className="flex flex-col items-center"
                >
                  <span className="font-heading text-2xl md:text-3xl text-gradient-gold whitespace-nowrap">
                    10th Nov
                  </span>
                  <span className="font-body text-champagne/60 text-xs tracking-luxury uppercase mt-1">
                    2026
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Spark burst, one-shot — skipped for reduced motion */}
          <AnimatePresence>
            {revealed && !reducedMotion && <SparkBurst key={burstKey} />}
          </AnimatePresence>

          {/* Left half — static */}
          <div className="absolute inset-0 overflow-hidden rounded-l-full">
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
              {/* Small drag-handle affordance, hints this half moves */}
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
