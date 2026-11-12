"use client";

import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { DIMENSION_LABELS } from "@/data/results";
import { startCheckout } from "@/lib/checkout/start";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import type { Dimension, ResultProfile, ScoreBreakdown } from "@/types/quiz";

const ORDER: Dimension[] = ["anxiety", "limits", "communication", "balanced"];

/** Resultado dentro da própria página: nome, frase, medidor, 3 ações e o botão de compra. */
export default function ResultCard({ profile, score }: { profile: ResultProfile; score: ScoreBreakdown }) {
  return (
    <div className="animate-q-in">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Seu padrão</p>
      <h3 className="mt-1.5 font-display text-[2.2rem] font-bold leading-[1.05] text-paper">{profile.name}</h3>
      <p className="mt-2 text-lg font-medium leading-snug text-gold-soft">{profile.line}</p>

      <div className="meter-on mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
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
                        style={{ ["--d" as string]: `${0.2 + row * 0.1 + i * 0.06}s` }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ul className="mt-5 flex flex-col gap-2.5">
        {profile.tips.map((tip) => (
          <li key={tip} className="flex items-start gap-3 text-[1.02rem] leading-snug text-paper">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Check size={14} strokeWidth={3} />
            </span>
            {tip}
          </li>
        ))}
      </ul>

      <p className="mt-6 font-display text-lg font-semibold leading-snug text-paper">
        Saber o padrão é o 1º passo. O guia mostra o 2º.
      </p>
      <Button
        onClick={() => {
          haptic(15);
          startCheckout();
        }}
        className="mt-3 min-h-14 w-full"
      >
        Quero acessar o guia
      </Button>
    </div>
  );
}
