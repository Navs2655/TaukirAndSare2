"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTO_ADVANCE_MS = 7000;

// Eight-pointed star (rub el hizb) — a traditional Islamic geometric motif,
// used sparingly here as a single ornament rather than a repeated pattern.
function GeometricStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="#C8A24F" strokeWidth="1">
        <polygon points="50,5 61,39 97,39 68,60 79,95 50,74 21,95 32,60 3,39 39,39" />
        <polygon
          points="50,5 61,39 97,39 68,60 79,95 50,74 21,95 32,60 3,39 39,39"
          transform="rotate(45 50 50)"
        />
      </g>
    </svg>
  );
}

interface BlessingItem {
  arabic: string;
  translation: string;
  source: string;
}

// All three verified against multiple sources before adding.
const BLESSINGS: BlessingItem[] = [
  {
    arabic:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    translation:
      '"And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy."',
    source: "Surah Ar-Rum, 30:21 — Sahih International",
  },
  {
    arabic:
      "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    translation:
      '"Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous."',
    source: "Surah Al-Furqan, 25:74 — Sahih International",
  },
  {
    arabic: "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    translation:
      '"May Allah bless you and shower His blessings upon you, and bring you together in goodness."',
    source: "Sunan Abu Dawud 2130, Sunan at-Tirmidhi 1091",
  },
];

export default function Blessings() {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-30% 0px" });

  // Auto-advance only while this section is in view, and never for users
  // who prefer reduced motion (they get a static first verse instead).
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!inView || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % BLESSINGS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [inView]);

  const current = BLESSINGS[index];

  return (
    <section
      id="blessings"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(31,92,74,0.12) 0%, rgba(9,9,9,0) 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
        whileInView={{ opacity: 0.5, rotate: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}
        className="relative z-10 w-16 h-16 md:w-20 md:h-20 mb-10"
      >
        <GeometricStar className="w-full h-full" />
      </motion.div>

      <div className="relative z-10 min-h-[280px] md:min-h-[240px] flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col items-center"
          >
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-champagne text-2xl md:text-4xl leading-loose text-center max-w-3xl mb-8"
            >
              {current.arabic}
            </p>
            <p className="font-heading text-xl md:text-2xl text-champagne/70 italic text-center max-w-xl leading-relaxed mb-5">
              {current.translation}
            </p>
            <p className="font-body text-gold text-xs tracking-luxury uppercase">
              {current.source}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual navigation dots */}
      <div className="relative z-10 flex items-center gap-3 mt-10">
        {BLESSINGS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show blessing ${i + 1} of ${BLESSINGS.length}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-gold" : "w-1.5 bg-gold/25 hover:bg-gold/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
