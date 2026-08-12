"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollJourneyThread() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });
  const topPercent = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center h-[42vh] pointer-events-none"
      aria-hidden="true"
    >
      <div className="relative w-px h-full bg-gold/15">
        <motion.div
          style={{ top: topPercent }}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {/* Small crescent moon marker */}
          <div className="relative w-3 h-3">
            <div
              className="absolute inset-0 rounded-full blur-[3px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(200,162,79,0.6) 0%, rgba(200,162,79,0) 70%)",
              }}
            />
            <div className="relative w-3 h-3 rounded-full bg-gold" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
