"use client";

import { motion } from "framer-motion";
import CrescentMoon from "@/components/ui/CrescentMoon";
import GeometricStar from "@/components/ui/GeometricStar";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Closing() {
  return (
    <section
      id="closing"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(200,162,79,0.08) 0%, rgba(9,9,9,0) 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}
        className="relative z-10 mb-10"
      >
        <CrescentMoon />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE }}
        className="relative z-10 font-heading text-3xl md:text-5xl text-gradient-gold text-center mb-6"
      >
        With Love &amp; Gratitude
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
        className="relative z-10 font-body text-champagne/60 text-sm md:text-base text-center max-w-md leading-relaxed mb-10"
      >
        Thank you for being part of Taukir &amp; Sara's journey. Your prayers
        and presence mean more to us than words can hold.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        lang="ar"
        dir="rtl"
        className="relative z-10 font-arabic text-gold text-xl md:text-2xl text-center mb-3"
      >
        بَارَكَ اللَّهُ لَكُمَا
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 font-body text-champagne/40 text-xs tracking-luxury uppercase"
      >
        May Allah bless you both
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 font-heading text-champagne/30 text-sm tracking-luxury mt-20"
      >
        Taukir &amp; Sara — 10.11.2026
      </motion.p>

      {/* Closing seal — a quiet echo of the Date Reveal's wax seal motif,
          bookending the journey (opens with a seal, closes with one). */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.9, ease: EASE }}
        className="relative z-10 mt-10 w-14 h-14 md:w-16 md:h-16 rounded-full border border-gold/30 flex items-center justify-center"
        aria-hidden="true"
      >
        <motion.div
          className="w-8 h-8 md:w-9 md:h-9"
          animate={{ opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <GeometricStar className="w-full h-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
