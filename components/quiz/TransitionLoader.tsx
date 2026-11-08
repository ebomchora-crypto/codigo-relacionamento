"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { haptic } from "@/lib/haptics";

const MESSAGES = [
  "Organizando suas respostas...",
  "Identificando os temas mais relevantes...",
  "Preparando suas recomendações...",
];

const STEP_MS = 600;

export default function TransitionLoader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (step >= MESSAGES.length) {
      haptic(30);
      const finish = window.setTimeout(onDone, 350);
      return () => window.clearTimeout(finish);
    }
    const timer = window.setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const done = step >= MESSAGES.length;
  const progress = Math.min(100, (Math.min(step, MESSAGES.length) / MESSAGES.length) * 100);

  return (
    <div className="texture-grain relative min-h-dvh overflow-hidden bg-ink">
      <AmbientBackground position="center" />
      <Container className="relative flex min-h-dvh flex-col items-center justify-center py-12 text-center">
        <div className="flex flex-col items-center gap-10">
          <svg viewBox="0 0 320 120" className="h-24 w-auto max-w-full" aria-hidden>
            <motion.circle
              cy="60"
              r="9"
              fill="#C6A15B"
              initial={{ cx: 50 }}
              animate={{ cx: reduce ? 150 : 150 }}
              transition={{ duration: 1.9, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.circle
              cy="60"
              r="9"
              fill="#09090B"
              stroke="#E4C990"
              strokeWidth="1.5"
              initial={{ cx: 270 }}
              animate={{ cx: 170 }}
              transition={{ duration: 1.9, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.line
              x1="50"
              x2="270"
              y1="60"
              y2="60"
              stroke="#C6A15B"
              strokeOpacity="0.35"
              strokeDasharray="2 7"
              initial={{ pathLength: 1, opacity: 1 }}
              animate={{ opacity: [1, 0.2] }}
              transition={{ duration: 1.9 }}
            />
            {!reduce &&
              done && (
                <motion.circle
                  cx="160"
                  cy="60"
                  r="9"
                  fill="none"
                  stroke="#E4C990"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 6 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  style={{ transformOrigin: "160px 60px", transformBox: "fill-box" }}
                />
              )}
          </svg>

          <div className="h-7 overflow-hidden" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={Math.min(step, MESSAGES.length - 1)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="font-body text-base text-mist"
              >
                {MESSAGES[Math.min(step, MESSAGES.length - 1)]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gold-fade"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
