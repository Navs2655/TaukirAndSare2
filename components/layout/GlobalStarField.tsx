"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import StarField from "@/components/ui/StarField";

export default function GlobalStarField() {
  const { scrollYProgress } = useScroll();
  // Bounded drift: stars move a small fraction slower than content across
  // the whole page — enough to read as depth, never far enough to leave gaps.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <StarField />
      </motion.div>
    </div>
  );
}
