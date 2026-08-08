"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Nikah: 10th November 2026, after Zuhr — using a mid-afternoon anchor time
// since "after Zuhr" isn't a fixed clock time. Adjust the hour below if needed.
const NIKAH_DATE = new Date("2026-11-10T13:30:00+05:30");

function getTimeLeft() {
  const diff = NIKAH_DATE.getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    isPast: diff <= 0,
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 md:gap-2 min-w-[48px] xs:min-w-[64px] md:min-w-[100px]">
      <span className="font-heading text-2xl xs:text-3xl md:text-6xl text-gradient-gold tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-body text-champagne/50 text-[9px] xs:text-[10px] md:text-xs tracking-luxury uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="countdown"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,162,79,0.08) 0%, rgba(9,9,9,0) 70%)",
        }}
      />

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative font-body text-gold text-xs tracking-luxury uppercase mb-4"
      >
        Counting Down To
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative font-heading text-4xl md:text-5xl text-champagne/90 mb-16 text-center"
      >
        Our Nikah Day
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
        className="relative flex items-start gap-1 xs:gap-3 md:gap-10 max-w-full overflow-x-auto px-2 no-scrollbar"
      >
        {time ? (
          time.isPast ? (
            <p className="font-heading text-3xl text-gradient-gold">
              The day has arrived
            </p>
          ) : (
            <>
              <TimeUnit value={time.days} label="Days" />
              <span className="font-heading text-lg xs:text-2xl md:text-5xl text-gold/30 -mt-1">:</span>
              <TimeUnit value={time.hours} label="Hours" />
              <span className="font-heading text-lg xs:text-2xl md:text-5xl text-gold/30 -mt-1">:</span>
              <TimeUnit value={time.minutes} label="Minutes" />
              <span className="font-heading text-lg xs:text-2xl md:text-5xl text-gold/30 -mt-1">:</span>
              <TimeUnit value={time.seconds} label="Seconds" />
            </>
          )
        ) : (
          // Static placeholder shown briefly during hydration to avoid layout shift
          <>
            <TimeUnit value={0} label="Days" />
            <span className="font-heading text-lg xs:text-2xl md:text-5xl text-gold/30 -mt-1">:</span>
            <TimeUnit value={0} label="Hours" />
            <span className="font-heading text-lg xs:text-2xl md:text-5xl text-gold/30 -mt-1">:</span>
            <TimeUnit value={0} label="Minutes" />
            <span className="font-heading text-lg xs:text-2xl md:text-5xl text-gold/30 -mt-1">:</span>
            <TimeUnit value={0} label="Seconds" />
          </>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="relative font-body text-champagne/40 text-sm tracking-wide mt-14"
      >
        10th November 2026 · Jumma Masjid, Junadeesa
      </motion.p>
    </section>
  );
}
