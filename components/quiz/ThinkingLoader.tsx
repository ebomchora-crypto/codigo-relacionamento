"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { haptic } from "@/lib/haptics";

/**
 * Tela de "pensando": barra de progresso (só transform) + mensagens que
 * trocam em intervalos iguais. Usada entre perguntas (3s) e no cálculo final (6s).
 */
export default function ThinkingLoader({
  durationMs,
  messages,
  title,
  checklist = false,
  onDone,
}: {
  durationMs: number;
  messages: string[];
  title?: string;
  /** No cálculo final, mostra as etapas com check conforme avançam. */
  checklist?: boolean;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const stepMs = durationMs / messages.length;
    const timers = messages.map((_, i) =>
      i === 0 ? 0 : window.setTimeout(() => setStep(i), stepMs * i),
    );
    const end = window.setTimeout(() => {
      haptic(checklist ? 30 : 10);
      onDone();
    }, durationMs);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink">
      <AmbientBackground position="center" />
      <Container className="relative flex min-h-dvh flex-col items-center justify-center gap-8 pb-consent text-center">
        <div className="relative flex h-24 w-24 items-center justify-center" aria-hidden>
          <span className="absolute inset-0 animate-ping-soft rounded-full border border-gold/50 [animation-iteration-count:infinite] [animation-duration:1.4s]" />
          <span
            className="absolute inset-3 rounded-full border-2 border-white/10 border-t-gold-soft"
            style={{ animation: "think-spin 0.9s linear infinite" }}
          />
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2 w-2 animate-dot-bounce rounded-full bg-gold-soft"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </span>
        </div>

        {title && <p className="font-display text-2xl font-semibold text-paper">{title}</p>}

        {checklist ? (
          <ul className="flex w-full max-w-xs flex-col gap-3 text-left" aria-live="polite">
            {messages.map((m, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li
                  key={m}
                  className="flex items-center gap-3 text-[1.02rem] transition-opacity duration-300"
                  style={{ opacity: i > step ? 0.25 : 1 }}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                      done ? "border-transparent bg-gold-fade text-ink" : "border-white/20"
                    }`}
                  >
                    {done && <Check size={14} strokeWidth={3.5} />}
                    {active && <span className="h-2 w-2 animate-pulse rounded-full bg-gold-soft" />}
                  </span>
                  <span className={done || active ? "text-paper" : "text-mist"}>{m}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p key={step} className="animate-fade-up text-lg text-paper" aria-live="polite">
            {messages[step]}
          </p>
        )}

        <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-full origin-left rounded-full bg-gold-fade"
            style={{ animation: `think-bar ${durationMs}ms linear forwards` }}
          />
        </div>
      </Container>
      <style>{`@keyframes think-bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes think-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
