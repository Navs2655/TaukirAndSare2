"use client";

import { useState, useEffect, useRef, ReactNode, MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import FloatingParticles from "@/components/ui/FloatingParticles";
import SparkBurst from "@/components/ui/SparkBurst";
import OrnamentalCorner from "@/components/ui/OrnamentalCorner";
import ArchMotif from "@/components/ui/ArchMotif";
import JaaliPattern from "@/components/ui/JaaliPattern";
import GeometricStar from "@/components/ui/GeometricStar";
import { useAudio } from "@/components/layout/AudioProvider";
import { vibrate } from "@/utils/vibrate";

const EASE = [0.16, 1, 0.3, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  };
}

export default function InvitationGate({
  children,
  navigation,
  audioToggle,
  scrollThread,
}: {
  children: ReactNode;
  navigation: ReactNode;
  audioToggle: ReactNode;
  scrollThread: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false); // gate fully removed from DOM
  const [contentMounted, setContentMounted] = useState(false); // main site mounted
  const [reacting, setReacting] = useState(false);
  const [opening, setOpening] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Subtle desktop-only tilt following the pointer — skipped on touch since
  // mousemove doesn't fire meaningfully there anyway.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 120, damping: 20 });
  const springTiltY = useSpring(tiltY, { stiffness: 120, damping: 20 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReducedMotion(prefersReducedMotion);

    if (prefersReducedMotion) {
      setIsOpen(true);
      setContentMounted(true);
    }
  }, []);

  // Scroll stays locked until the main site is actually mounted and visible —
  // not tied to the gate's own fade timing, so nothing scrolls prematurely.
  useEffect(() => {
    document.body.style.overflow = contentMounted ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [contentMounted]);

  const { play } = useAudio();

  const handleCardMouseMove = (e: ReactMouseEvent) => {
    if (reducedMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(relX * 8);
    tiltX.set(relY * -8);
  };

  const handleCardMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const handleOpen = () => {
    play();
    vibrate([50, 30, 80]); // richer pulse for the main "unlock" moment, Android only

    if (reducedMotion) {
      setIsOpen(true);
      setContentMounted(true);
      return;
    }

    // Phase 1 (0–160ms) — the card reacts to the click before anything opens
    setReacting(true);

    // Phase 2 & 3 (160ms onward) — cover opens, light/particles burst,
    // layered animations orchestrated via the `opening` flag below
    setTimeout(() => setOpening(true), 160);

    // Main site mounts partway through the gate's own fade, so its entrance
    // animation cross-fades with the dissolving cover instead of popping in
    // after a hard cut.
    setTimeout(() => setContentMounted(true), 850);

    // Gate is fully removed only once its fade+blur animation has actually
    // finished playing — total sequence lands around 1.8s from the click,
    // fast enough to feel responsive while still reading as cinematic.
    setTimeout(() => setIsOpen(true), 1800);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="gate"
            className={`fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-6 ${
              opening ? "pointer-events-none" : ""
            }`}
            animate={
              opening ? { opacity: 0 } : { opacity: 1 }
            }
            transition={{ duration: 0.7, delay: opening ? 0.75 : 0, ease: EASE }}
          >
            {/* Ambient background layer — jaali texture, soft light, particles */}
            <JaaliPattern className="absolute inset-0 opacity-[0.05]" />
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200,162,79,0.1) 0%, rgba(9,9,9,0) 70%)",
              }}
              animate={
                !reducedMotion
                  ? { opacity: [0.6, 1, 0.6] }
                  : {}
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 pointer-events-none">
              <FloatingParticles count={14} />
            </div>

            {/* Decorative arch, framing the card like a mehrab/mandap doorway */}
            <motion.div
              animate={
                opening
                  ? { scale: 1.12, opacity: 0 }
                  : { scale: 1, opacity: 0.5 }
              }
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="absolute w-72 md:w-96 h-[85%] pointer-events-none"
            >
              <ArchMotif className="w-full h-full" />
            </motion.div>

            {/* The invitation card itself */}
            <div style={{ perspective: 1200 }} className="relative z-10">
              <motion.div
                ref={cardRef}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  rotateX: springTiltX,
                  rotateY: springTiltY,
                  transformOrigin: "bottom center",
                }}
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={
                  opening
                    ? { rotateX: -105, opacity: 0 }
                    : reacting
                    ? { opacity: 1, y: 0, scale: [1, 0.97, 1.01, 1] }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                transition={
                  opening
                    ? { duration: 0.65, delay: 0.05, ease: EASE }
                    : reacting
                    ? { duration: 0.35, ease: EASE }
                    : { duration: 0.9, ease: EASE }
                }
                className="relative w-full max-w-[300px] sm:max-w-sm px-8 py-12 sm:px-10 sm:py-14"
              >
                {/* Back paper layer — slight offset, gives layered-paper depth */}
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-sm border border-gold/10 bg-white/[0.015]" />

                {/* Front paper layer */}
                <div className="absolute inset-0 rounded-sm border border-gold/25 bg-white/[0.025] backdrop-blur-[1px]" />

                {/* Ornamental corners */}
                <OrnamentalCorner className="absolute top-2 left-2 w-10 h-10 sm:w-12 sm:h-12" />
                <OrnamentalCorner className="absolute top-2 right-2 w-10 h-10 sm:w-12 sm:h-12 -scale-x-100" />
                <OrnamentalCorner className="absolute bottom-2 left-2 w-10 h-10 sm:w-12 sm:h-12 -scale-y-100" />
                <OrnamentalCorner className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 -scale-x-100 -scale-y-100" />

                {/* Card content */}
                <div className="relative flex flex-col items-center text-center">
                  <motion.p
                    {...fadeUp(0.1)}
                    className="font-arabic text-gold text-lg sm:text-xl mb-6"
                    lang="ar"
                    dir="rtl"
                  >
                    بِسْمِ اللَّهِ
                  </motion.p>

                  {/* Seal emblem */}
                  <motion.div
                    {...fadeUp(0.2)}
                    animate={
                      reacting
                        ? { scale: [1, 1.12, 1] }
                        : opening
                        ? { scale: 1.3, opacity: 0 }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={
                      reacting
                        ? { duration: 0.5, ease: EASE }
                        : opening
                        ? { duration: 0.7, delay: 0.05, ease: EASE }
                        : { duration: 0.9, delay: 0.45, ease: EASE }
                    }
                    className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-6"
                  >
                    <motion.span
                      className="absolute inset-0 rounded-full border border-gold/40"
                      animate={
                        reacting || opening
                          ? { opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }
                          : !reducedMotion
                          ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.08, 1] }
                          : {}
                      }
                      transition={{
                        duration: reacting || opening ? 0.6 : 2.8,
                        repeat: reacting || opening ? 0 : Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(200,162,79,0.3) 0%, rgba(200,162,79,0) 70%)",
                      }}
                    />
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                      <GeometricStar className="w-full h-full" />
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={
                      opening ? { opacity: 0 } : { opacity: 1, y: 0 }
                    }
                    transition={{ duration: opening ? 0.4 : 0.7, delay: opening ? 0 : 0.3, ease: EASE }}
                    className="font-body text-champagne/50 text-xs tracking-luxury uppercase mb-1"
                  >
                    You Are Invited
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={
                      opening ? { opacity: 0 } : { opacity: 1, y: 0 }
                    }
                    transition={{ duration: opening ? 0.4 : 0.7, delay: opening ? 0 : 0.35, ease: EASE }}
                    className="flex items-center gap-3 mb-10"
                  >
                    <span className="w-5 h-px bg-gold/40" />
                    <span className="font-heading text-champagne/70 text-base sm:text-lg tracking-wide">
                      Taukir <span className="text-gold text-sm align-middle">♡</span> Sara
                    </span>
                    <span className="w-5 h-px bg-gold/40" />
                  </motion.div>

                  {/* Open Invitation — integrated label, not a standard pill button */}
                  <motion.div {...fadeUp(0.45)}>
                    <Magnetic>
                      <button
                        onClick={handleOpen}
                        className="group pointer-events-auto relative flex items-center gap-2 font-body text-xs tracking-luxury uppercase text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
                        aria-label="Open the invitation"
                      >
                        <span className="relative">
                          Open Invitation
                          <span className="absolute left-0 -bottom-1.5 w-full h-px bg-gold/40 origin-left scale-x-75 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                        </span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          aria-hidden="true"
                        >
                          →
                        </motion.span>
                      </button>
                    </Magnetic>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Light burst + particle burst on opening */}
            {opening && (
              <>
                <motion.div
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 1.3, delay: 0.3, ease: EASE }}
                  className="absolute w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(200,162,79,0.5) 0%, rgba(200,162,79,0) 70%)",
                  }}
                  aria-hidden="true"
                />
                {!reducedMotion && (
                  <div className="absolute">
                    <SparkBurst count={12} minDistance={40} maxDistanceAdd={80} />
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nothing from the main site — nav, audio toggle, or content — exists
          in the DOM until the invitation is actually opened. This isn't just
          visually hidden; it isn't mounted, so entrance animations play fresh
          exactly when revealed, cross-fading naturally with the gate's own
          dissolve above for a continuous "cover becomes the website" feel. */}
      {contentMounted && (
        <>
          {navigation}
          {children}
          {audioToggle}
          {scrollThread}
        </>
      )}
    </>
  );
}
