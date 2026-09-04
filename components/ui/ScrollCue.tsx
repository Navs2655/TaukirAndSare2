"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ScrollCue({ label }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 motion-reduce:hidden"
    >
      {label && (
        <span className="font-body text-champagne/30 text-[10px] tracking-luxury uppercase whitespace-nowrap">
          {label}
        </span>
      )}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-4 h-4 text-gold/40" />
      </motion.div>
    </motion.div>
  );
}
