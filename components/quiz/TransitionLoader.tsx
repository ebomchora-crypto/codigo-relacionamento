"use client";

import { useEffect } from "react";
import Container from "@/components/ui/Container";
import { haptic } from "@/lib/haptics";

const DURATION_MS = 1300;

/** Anel de progresso em CSS (stroke-dashoffset), ~1,3s. Cria expectativa sem pesar. */
export default function TransitionLoader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      haptic(30);
      onDone();
    }, DURATION_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-dvh bg-ink">
      <Container className="flex min-h-dvh flex-col items-center justify-center gap-7 text-center">
        <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#E4C990"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="276.5"
            strokeDashoffset="276.5"
            style={{ animation: `ring-fill ${DURATION_MS}ms cubic-bezier(0.4,0,0.2,1) forwards` }}
          />
        </svg>
        <p className="font-display text-xl font-semibold text-paper" aria-live="polite">
          Lendo o seu padrão…
        </p>
      </Container>
      <style>{`@keyframes ring-fill{to{stroke-dashoffset:0}}`}</style>
    </div>
  );
}
