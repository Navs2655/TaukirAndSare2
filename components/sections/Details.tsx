"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Moon, Sparkles, MapPin, CalendarPlus } from "lucide-react";
import { downloadNikahCalendar } from "@/utils/calendar";

const EASE = [0.16, 1, 0.3, 1] as const;

interface EventInfo {
  icon: React.ReactNode;
  label: string;
  date: string;
  time: string;
  venue: string;
  mapQuery: string;
}

const EVENTS: EventInfo[] = [
  {
    icon: <Moon className="w-6 h-6" />,
    label: "Nikah",
    date: "10th November 2026",
    time: "After Zuhr",
    venue: "Jumma Masjid, Junadeesa",
    mapQuery: "Jumma Masjid, Junadeesa",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    label: "Walima",
    date: "11th November 2026",
    time: "12:00 PM",
    venue: "Junadeesa",
    mapQuery: "Junadeesa",
  },
];

function EventCard({ event, index }: { event: EventInfo; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.mapQuery
  )}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.2, ease: EASE }}
      className="relative flex flex-col items-center text-center gap-4 bg-white/[0.03] border border-gold/20 rounded-2xl px-8 py-10 backdrop-blur-sm w-full max-w-sm"
    >
      <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center text-gold">
        {event.icon}
      </div>
      <h3 className="font-heading text-3xl text-gradient-gold">{event.label}</h3>
      <p className="font-body text-champagne/90 text-sm tracking-wide">
        {event.date}
      </p>
      <p className="font-body text-gold text-sm tracking-luxury uppercase">
        {event.time}
      </p>
      <p className="font-body text-champagne/60 text-sm flex items-center gap-1.5">
        <MapPin className="w-4 h-4 shrink-0" />
        {event.venue}
      </p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-xs tracking-luxury uppercase text-champagne/70 border-b border-gold/40 pb-0.5 hover:text-gold hover:border-gold transition-colors duration-300"
      >
        Get Directions
      </a>
    </motion.div>
  );
}

export default function Details() {
  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-10% 0px" });

  return (
    <section
      id="details"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 overflow-hidden"
    >
      {/* Anchor for the "Timeline" nav item — same section, chronological content */}
      <span id="timeline" className="absolute -top-24" aria-hidden="true" />

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="font-body text-gold text-xs tracking-luxury uppercase mb-4"
      >
        The Celebration
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="font-heading text-4xl md:text-5xl text-champagne/90 mb-16 text-center"
      >
        Two Days, One Blessing
      </motion.h2>

      <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-6 w-full max-w-4xl">
        <EventCard event={EVENTS[0]} index={0} />

        {/* Connecting thread */}
        <div
          ref={lineRef}
          className="relative w-[2px] h-16 md:w-24 md:h-[2px] bg-gold/10 shrink-0"
          aria-hidden="true"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={lineInView ? { scale: 1 } : {}}
            transition={{ duration: 1, ease: EASE }}
            className="absolute inset-0 bg-gold"
            style={{ transformOrigin: "top left" }}
          />
        </div>

        <EventCard event={EVENTS[1]} index={1} />
      </div>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        onClick={downloadNikahCalendar}
        className="relative z-10 flex items-center gap-2 mt-14 px-7 py-3 font-body text-xs tracking-luxury uppercase text-champagne border border-gold/40 rounded-full hover:border-gold hover:bg-gold/5 transition-colors duration-300"
      >
        <CalendarPlus className="w-4 h-4" />
        Add to Calendar
      </motion.button>
    </section>
  );
}
