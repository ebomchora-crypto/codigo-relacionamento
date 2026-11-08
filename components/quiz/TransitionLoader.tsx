"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";

const MESSAGES = [
  "Organizando suas respostas...",
  "Identificando os temas mais relevantes...",
  "Preparando suas recomendações...",
];

const STEP_MS = 550;

export default function TransitionLoader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= MESSAGES.length) {
      const finish = window.setTimeout(onDone, 150);
      return () => window.clearTimeout(finish);
    }
    const timer = window.setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const progress = Math.min(100, ((step + 1) / MESSAGES.length) * 100);

  return (
    <Container className="flex min-h-screen flex-col items-center justify-center py-12 text-center">
      <div className="flex flex-col items-center gap-8">
        <div className="relative h-14 w-14">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
        </div>

        <div className="h-7 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={Math.min(step, MESSAGES.length - 1)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
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
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </Container>
  );
}
