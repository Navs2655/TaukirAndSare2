"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import { useAudio } from "@/components/layout/AudioProvider";

const EASE = [0.16, 1, 0.3, 1] as const;
const SESSION_KEY = "invitationOpened";

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
            {/* Center card content — fades first */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pointer-events-none"
            >
              <p className="font-arabic text-gold text-xl mb-6" lang="ar" dir="rtl">
                بِسْمِ اللَّهِ
              </p>
              <div className="border border-gold/30 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                <span className="font-heading text-3xl text-gradient-gold">
                  T&nbsp;&amp;&nbsp;S
                </span>
              </div>
              <p className="font-body text-champagne/50 text-xs tracking-luxury uppercase mb-1">
                Walima &amp; Nikah
              </p>
              <p className="font-heading text-gold text-lg tracking-wide mb-10">
                10th November 2026
              </p>
              <Magnetic>
                <motion.button
                  onClick={handleOpen}
                  whileTap={{ scale: 0.95 }}
                  className="pointer-events-auto relative px-8 py-3.5 font-body text-xs tracking-luxury uppercase text-champagne border border-gold/50 rounded-full"
                  aria-label="Open the invitation"
                >
                  <motion.span
                    className="absolute inset-0 rounded-full border border-gold/40"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden="true"
                  />
                  <span className="relative">Tap to Open</span>
                </motion.button>
              </Magnetic>
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
