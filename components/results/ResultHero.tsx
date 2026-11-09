"use client";

import Container from "@/components/ui/Container";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { DIMENSION_LABELS } from "@/data/results";
import { cn } from "@/lib/utils";
import type { Dimension, ResultProfile, ScoreBreakdown } from "@/types/quiz";

const ORDER: Dimension[] = ["anxiety", "limits", "communication", "balanced"];

/**
 * Resultado em 5 segundos: nome do padrão (grande), uma frase, o medidor
 * visual das 4 dimensões e 3 ações curtas. Só transform/opacity animam.
 */
export default function ResultHero({
  profile,
  score,
}: {
  profile: ResultProfile;
  score: ScoreBreakdown;
}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-8 pt-[max(2.5rem,env(safe-area-inset-top))]">
      <AmbientBackground />
      <Container className="relative">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          Seu padrão
        </p>
        <h1
          className="mt-2 animate-fade-up font-display text-[2.6rem] font-bold leading-[1.05] text-paper min-[380px]:text-5xl"
          style={{ animationDelay: "80ms" }}
        >
          {profile.name}
        </h1>
        <p
          className="mt-3 animate-fade-up text-lg font-medium leading-snug text-gold-soft"
          style={{ animationDelay: "160ms" }}
        >
          {profile.line}
        </p>

        <div
          className="meter-on mt-8 flex animate-fade-up flex-col gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          style={{ animationDelay: "240ms" }}
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
                          className={cn(
                            "meter-seg meter-seg-on block h-full rounded-full",
                            leader ? "bg-gold-fade" : "bg-mist/70",
                          )}
                          style={{ ["--d" as string]: `${0.5 + row * 0.12 + i * 0.07}s` }}
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
