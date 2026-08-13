"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const TRACK_HEIGHT_PX = 260; // matches h-[260px] below

export default function ScrollJourneyThread() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });
  // translateY in px — GPU-composited transform instead of animating `top`
  const markerY = useTransform(smoothProgress, [0, 1], [0, TRACK_HEIGHT_PX]);

  return (
    <div
      className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center pointer-events-none"
      style={{ height: TRACK_HEIGHT_PX }}
      aria-hidden="true"
    >
      <div className="relative w-px h-full bg-gold/15">
        <motion.div
          style={{ y: markerY }}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0"
        >
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
