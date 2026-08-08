"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import CrescentMoon from "@/components/ui/CrescentMoon";
import FloatingParticles from "@/components/ui/FloatingParticles";
import Magnetic from "@/components/ui/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EASE },
  };
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Moon drifts upward slightly slower than the rest of the content as you
  // scroll through the Hero — a subtle depth cue, not a dramatic effect.
  const moonY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const moonOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  const handleBeginJourney = () => {
    document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Layered night backdrop — transparent so the global star field shows through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(31,92,74,0.18) 0%, rgba(9,9,9,0) 60%)",
        }}
      />
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
        <motion.div style={{ y: moonY, opacity: moonOpacity }}>
          <CrescentMoon />
        </motion.div>

        <motion.p
          {...fadeUp(0.9)}
          className="font-arabic text-gold text-2xl md:text-3xl mt-8 mb-3"
          lang="ar"
          dir="rtl"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </motion.p>

        <motion.p
          {...fadeUp(1.15)}
          className="font-body text-champagne/50 text-xs md:text-sm tracking-luxury uppercase mb-10"
        >
          In the name of Allah, the Most Gracious, the Most Merciful
        </motion.p>

        <motion.h1
          {...fadeUp(1.4)}
          className="font-heading text-4xl xs:text-5xl sm:text-6xl md:text-8xl leading-none"
        >
          <span className="text-gradient-gold">Taukir</span>
          <span className="text-champagne/30 mx-4 md:mx-6 font-light">
            &amp;
          </span>
          <span className="text-gradient-gold">Sara</span>
        </motion.h1>

        <motion.p
          {...fadeUp(1.7)}
          className="font-body text-champagne/60 text-sm md:text-base tracking-luxury uppercase mt-6"
        >
          Request the honor of your presence at their Nikah
        </motion.p>

        <Magnetic>
          <motion.button
            {...fadeUp(2.0)}
            onClick={handleBeginJourney}
            className="group relative mt-14 px-10 py-4 font-body text-sm tracking-luxury uppercase text-champagne border border-gold/40 rounded-full overflow-hidden transition-colors duration-500 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
              style={{
                background:
                  "radial-gradient(circle, rgba(200,162,79,0.4) 0%, rgba(200,162,79,0) 70%)",
              }}
              aria-hidden="true"
            />
            <span className="relative">Begin Journey</span>
          </motion.button>
        </Magnetic>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.6 }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2 motion-reduce:hidden"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-gold/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
