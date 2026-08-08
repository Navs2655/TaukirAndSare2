"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";

interface AudioContextValue {
  playing: boolean;
  play: () => void;
  toggle: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false)); // silently ignore if browser still blocks it
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      play();
    }
  };

  return (
    <AudioCtx.Provider value={{ playing, play, toggle }}>
      <audio ref={audioRef} loop preload="none">
        <source
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/audio/nasheed.mp3`}
          type="audio/mpeg"
        />
      </audio>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
