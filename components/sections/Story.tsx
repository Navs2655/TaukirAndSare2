"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// EDIT ME: replace with the real story
const STORY_LINES = [
  "Every story finds its own quiet beginning.",
  "Two families, two paths, brought together by faith and by fate.",
  "What started as words exchanged with care",
  "has grown into a promise the both of them are ready to keep —",
  "in front of Allah, their families, and each other.",
];

function StoryLine({ text, index }: { text: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.15, ease: EASE }}
      className="font-heading text-2xl md:text-4xl leading-relaxed text-champagne/90 text-center"
    >
      {text}
    </motion.p>
  );
}

export default function Story() {
  const dividerRef = useRef(null);
  const dividerInView = useInView(dividerRef, { once: true, margin: "-20% 0px" });

  return (
    <section
      id="story"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 overflow-hidden"
    >
      {/* Ambient emerald wash, distinct from Hero's gold-dominant palette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(31,92,74,0.15) 0%, rgba(9,9,9,0) 65%)",
        }}
      />

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-10">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-body text-gold text-xs tracking-luxury uppercase"
        >
          Our Story
        </motion.span>

        {/* Ink-drawn divider */}
        <svg
          ref={dividerRef}
          width="120"
          height="2"
          viewBox="0 0 120 2"
          aria-hidden="true"
        >
          <motion.line
            x1="0"
            y1="1"
            x2="120"
            y2="1"
            stroke="#C8A24F"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={dividerInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </svg>

        <div className="flex flex-col gap-8 mt-4">
          {STORY_LINES.map((line, i) => (
            <StoryLine key={i} text={line} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
