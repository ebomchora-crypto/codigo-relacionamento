"use client";

import Container from "@/components/ui/Container";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { DIMENSION_LABELS } from "@/data/results";
import { useCountUp } from "@/lib/useCountUp";
import { cn } from "@/lib/utils";
import type { Dimension, ResultProfile, ScoreBreakdown } from "@/types/quiz";

const ORDER: Dimension[] = ["anxiety", "limits", "communication", "balanced"];
const R = 52;
const CIRC = 2 * Math.PI * R;

/**
 * Resultado com impacto: anel que se desenha, número que sobe, nome do
 * padrão, medidor das 4 dimensões e brilhos. Só transform/opacity/stroke.
 */
export default function ResultHero({ profile, score }: { profile: ResultProfile; score: ScoreBreakdown }) {
  const pct = Math.round((score[profile.id] / 5) * 100);
  const shown = useCountUp(pct, 1200, 350);
  const offset = CIRC * (1 - pct / 100);

  return (
    <section className="relative overflow-hidden bg-ink pb-8 pt-[max(2rem,env(safe-area-inset-top))]">
      <AmbientBackground />
      {[18, 78, 88, 8].map((left, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-gold-soft"
          style={{ left: `${left}%`, top: `${14 + i * 9}%`, animation: `sparkle 2.4s ease-in-out ${0.6 + i * 0.5}s infinite` }}
        />
      ))}
      <Container className="relative">
        <p className="animate-fade-up text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Resultado pronto
        </p>

        <div className="relative mx-auto mt-4 h-40 w-40 animate-pop" style={{ animationDelay: "120ms" }}>
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#E4C990"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              style={
                {
                  "--circ": CIRC,
                  "--off": offset,
                  strokeDashoffset: offset,
                  animation: "ring-draw 1.3s cubic-bezier(0.22,1,0.36,1) 0.35s both",
                } as React.CSSProperties
              }
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[2.6rem] font-bold leading-none text-paper tabular-nums">
              {shown}
              <span className="text-xl text-gold-soft">%</span>
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-wider text-mist">do seu padrão</span>
          </div>
        </div>

        <h1
          className="mt-5 animate-fade-up text-center font-display text-[2.5rem] font-bold leading-[1.05] text-paper min-[380px]:text-5xl"
          style={{ animationDelay: "300ms" }}
        >
          {profile.name}
        </h1>
        <p
          className="mx-auto mt-3 max-w-xs animate-fade-up text-center text-lg font-medium leading-snug text-gold-soft"
          style={{ animationDelay: "420ms" }}
        >
          {profile.line}
        </p>
        <p className="mt-2 animate-fade-up text-center text-sm text-mist" style={{ animationDelay: "500ms" }}>
          {score[profile.id]} das suas 5 respostas apontam para esse padrão.
        </p>

        <div
          className="meter-on mt-7 flex animate-fade-up flex-col gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          style={{ animationDelay: "600ms" }}
        >
          {ORDER.map((dim, row) => {
            const value = score[dim];
            const leader = dim === profile.id;
            return (
              <div key={dim} className="flex items-center gap-3">
                <span className={cn("w-[5.6rem] shrink-0 text-[13px]", leader ? "font-semibold text-paper" : "text-mist")}>
                  {DIMENSION_LABELS[dim]}
                </span>
                <div className="flex flex-1 gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      {i < value && (
                        <span
                          className={cn("meter-seg meter-seg-on block h-full rounded-full", leader ? "bg-gold-fade" : "bg-mist/70")}
                          style={{ ["--d" as string]: `${0.9 + row * 0.12 + i * 0.07}s` }}
                        />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
