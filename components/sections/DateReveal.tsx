"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import OrnamentalCorner from "@/components/ui/OrnamentalCorner";
import SparkBurst from "@/components/ui/SparkBurst";
import ScrollCue from "@/components/ui/ScrollCue";
import { vibrate } from "@/utils/vibrate";

const EASE = [0.16, 1, 0.3, 1] as const;
const REVEAL_THRESHOLD = 0.3; // 30% scratched triggers auto-reveal
const BRUSH_RADIUS = 24;
const MASK_W = 48; // tiny sampling canvas - cheap to read regardless of device
const MASK_H = 28;
const CHECK_INTERVAL_MS = 150;

export default function DateReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratchingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastCheckRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });

  const [revealed, setRevealed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Draw the gold-foil scratch surface, and set up the tiny offscreen
  // sampling canvas used to cheaply check scratch progress.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    maskCanvasRef.current = document.createElement("canvas");
    maskCanvasRef.current.width = MASK_W;
    maskCanvasRef.current.height = MASK_H;
    // Critical: fill with an opaque base first. Without this, a brand-new
    // canvas starts fully transparent by default, meaning the very first
    // progress check would already read as 100% "scratched" regardless of
    // any actual scratching — this was the bug causing instant reveal.
    const initialMaskCtx = maskCanvasRef.current.getContext("2d");
    if (initialMaskCtx) {
      initialMaskCtx.fillStyle = "#000";
      initialMaskCtx.fillRect(0, 0, MASK_W, MASK_H);
    }

    function draw() {
      const rect = container!.getBoundingClientRect();
      sizeRef.current = { width: rect.width, height: rect.height };
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, "#F7F3EA");
      grad.addColorStop(0.45, "#C8A24F");
      grad.addColorStop(0.55, "#8a6f3a");
      grad.addColorStop(1, "#C8A24F");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      for (let i = -rect.height; i < rect.width; i += 14) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + rect.height, rect.height);
        ctx.stroke();
      }

      ctx.fillStyle = "#090909";
      ctx.globalAlpha = 0.75;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "600 15px Georgia, serif";
      ctx.fillText("Scratch to Reveal", rect.width / 2, rect.height / 2 - 12);
      ctx.font = "italic 12px Georgia, serif";
      ctx.fillText("Our Nikah Date", rect.width / 2, rect.height / 2 + 10);
      ctx.globalAlpha = 1;
    }

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  const checkRevealProgress = useCallback(() => {
    const mask = maskCanvasRef.current;
    if (!mask) return;
    const ctx = mask.getContext("2d");
    if (!ctx) return;
    const { data } = ctx.getImageData(0, 0, MASK_W, MASK_H);
    let transparent = 0;
    const totalPixels = MASK_W * MASK_H;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 40) transparent++;
    }
    if (transparent / totalPixels > REVEAL_THRESHOLD) {
      triggerFullReveal();
    }
  }, []);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const mask = maskCanvasRef.current;
      if (!canvas || !mask) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineCap = "round";
        ctx.lineWidth = BRUSH_RADIUS * 2;
        ctx.beginPath();
        const last = lastPointRef.current;
        if (last) {
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Mirror the same stroke onto the tiny sampling canvas, scaled down —
      // this is what keeps progress-checking cheap regardless of device.
      const maskCtx = mask.getContext("2d");
      if (maskCtx && sizeRef.current.width > 0) {
        const scaleX = MASK_W / sizeRef.current.width;
        const scaleY = MASK_H / sizeRef.current.height;
        maskCtx.globalCompositeOperation = "destination-out";
        maskCtx.fillStyle = "#000";
        maskCtx.beginPath();
        maskCtx.arc(x * scaleX, y * scaleY, BRUSH_RADIUS * scaleX, 0, Math.PI * 2);
        maskCtx.fill();
      }

      lastPointRef.current = { x, y };

      const now = performance.now();
      if (now - lastCheckRef.current > CHECK_INTERVAL_MS) {
        lastCheckRef.current = now;
        checkRevealProgress();
      }
    },
    [checkRevealProgress]
  );

  const triggerFullReveal = () => {
    setRevealed((prev) => {
      if (prev) return prev;
      setBurstKey((k) => k + 1);
      vibrate(40);
      return true;
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    setHasStarted(true);
    isScratchingRef.current = true;
    lastPointRef.current = null;
    e.currentTarget.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current || revealed) return;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isScratchingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <section
      id="date-reveal"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,162,79,0.1) 0%, rgba(9,9,9,0) 70%)",
        }}
      />

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 font-body text-gold text-xs tracking-luxury uppercase mb-4"
      >
        A Blessed Date Awaits
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-10 font-heading text-3xl md:text-4xl text-champagne/90 mb-4 text-center"
      >
        Scratch to Reveal Our Nikah Date
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 font-body text-champagne/40 text-xs tracking-wide text-center mb-12 max-w-xs"
      >
        Use your finger or mouse to gently scratch the card below
      </motion.p>

      <div className="relative z-10 flex flex-col items-center">
        <div
          ref={containerRef}
          className="relative w-72 h-44 sm:w-80 sm:h-48 rounded-2xl border border-gold/25 bg-white/[0.02] overflow-hidden"
        >
          <OrnamentalCorner className="absolute top-1 left-1 w-8 h-8 z-20 pointer-events-none" />
          <OrnamentalCorner className="absolute top-1 right-1 w-8 h-8 z-20 pointer-events-none -scale-x-100" />
          <OrnamentalCorner className="absolute bottom-1 left-1 w-8 h-8 z-20 pointer-events-none -scale-y-100" />
          <OrnamentalCorner className="absolute bottom-1 right-1 w-8 h-8 z-20 pointer-events-none -scale-x-100 -scale-y-100" />

          {/* Guaranteed date layer — plain CSS opacity, driven only by
              `revealed`, same reliability principle as before: nothing
              about the scratch canvas can prevent this from showing. */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ease-out ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="font-heading text-3xl md:text-4xl text-gradient-gold">
              10th November
            </span>
            <span className="font-body text-champagne/60 text-sm tracking-luxury uppercase mt-1">
              2026
            </span>
          </div>

          {revealed && !reducedMotion && (
            <div key={burstKey} className="absolute inset-0 pointer-events-none z-10">
              <SparkBurst />
            </div>
          )}

          <motion.canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            animate={revealed ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0 z-10 cursor-pointer"
            style={{ touchAction: "none" }}
            aria-hidden="true"
          />

          {!hasStarted && !reducedMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [0, 22, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.6 },
                x: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1 },
              }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-5 h-5 rounded-full bg-champagne/60 blur-[1px] pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>

        {!revealed && (
          <button
            onClick={triggerFullReveal}
            className="mt-6 text-[11px] tracking-wide text-champagne/30 hover:text-gold/70 transition-colors duration-300 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
          >
            Reveal without scratching
          </button>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-champagne/40 text-xs tracking-luxury uppercase mt-8"
        >
          {revealed ? "The date is set" : "Scratch to Reveal"}
        </motion.p>

        {revealed && <ScrollCue label="Their Story Continues" />}
      </div>
    </section>
  );
}
