"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import FloatingParticles from "@/components/ui/FloatingParticles";
import { useAudio } from "@/components/layout/AudioProvider";

const EASE = [0.16, 1, 0.3, 1] as const;
const SESSION_KEY = "invitationOpened";

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
}: {
  children: ReactNode;
  navigation: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [gateRemoved, setGateRemoved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReducedMotion(prefersReducedMotion);

    const alreadyOpened = sessionStorage.getItem(SESSION_KEY) === "true";
    if (alreadyOpened || prefersReducedMotion) {
      setIsOpen(true);
      setGateRemoved(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const { play } = useAudio();

  const handleOpen = () => {
    setIsOpen(true);
    sessionStorage.setItem(SESSION_KEY, "true");
    play(); // tied directly to this click, so autoplay restrictions allow it
  };

  // Avoid a flash of the gate before we know session state
  if (!hydrated) return null;

  return (
    <>
      <AnimatePresence onExitComplete={() => setGateRemoved(true)}>
        {!isOpen && (
          <motion.div
            key="gate"
            className="fixed inset-0 z-[60] flex"
            exit={{ transitionEnd: { display: "none" } }}
          >
            {/* Ambient motion on the closed card, matching the site's existing language */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <FloatingParticles count={14} />
            </div>

            {/* Center card content — fades first */}
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pointer-events-none"
            >
              <motion.p
                {...fadeUp(0.2)}
                className="font-arabic text-gold text-xl mb-6"
                lang="ar"
                dir="rtl"
              >
                بِسْمِ اللَّهِ
              </motion.p>

              <motion.div
                {...fadeUp(0.45)}
                className="relative border border-gold/30 rounded-full w-24 h-24 flex items-center justify-center mb-6"
              >
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(200,162,79,0.25) 0%, rgba(200,162,79,0) 70%)",
                  }}
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />
                <span className="relative font-heading text-3xl text-gradient-gold">
                  T&nbsp;&amp;&nbsp;S
                </span>
              </motion.div>

              <motion.p
                {...fadeUp(0.65)}
                className="font-body text-champagne/50 text-xs tracking-luxury uppercase mb-10"
              >
                You Are Invited
              </motion.p>

              <motion.div {...fadeUp(0.9)}>
                <Magnetic>
                  <motion.button
                    onClick={handleOpen}
                    whileTap={{ scale: 0.95 }}
                    className="pointer-events-auto relative px-8 py-3.5 font-body text-xs tracking-luxury uppercase text-champagne border border-gold/50 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
                    aria-label="Open the invitation"
                  >
                    <motion.span
                      className="absolute inset-0 rounded-full border border-gold/40"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      aria-hidden="true"
                    />
                    <span className="relative">Open Invitation</span>
                  </motion.button>
                </Magnetic>
              </motion.div>
            </motion.div>

            {/* Left door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
              className="w-1/2 h-full bg-background border-r border-gold/15"
            />
            {/* Right door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
              className="w-1/2 h-full bg-background border-l border-gold/15"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {gateRemoved && navigation}
      <div className={isOpen ? "" : "invisible"} aria-hidden={!isOpen}>
        {children}
      </div>
    </>
  );
}
