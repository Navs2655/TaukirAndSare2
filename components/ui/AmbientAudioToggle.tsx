"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/components/layout/AudioProvider";

export default function AmbientAudioToggle() {
  const { playing, toggle } = useAudio();

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      aria-label={playing ? "Mute background audio" : "Play background audio"}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full border border-gold/30 bg-background/70 backdrop-blur-sm flex items-center justify-center text-gold hover:border-gold transition-colors duration-300"
    >
      {playing ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </motion.button>
  );
}
