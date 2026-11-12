"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";
import { RESULT_PROFILES } from "@/data/results";
import { classifyAnswers } from "@/lib/scoring/engine";
import { haptic } from "@/lib/haptics";
import {
  trackQuizStart,
  trackQuizQuestionReached,
  trackQuizAnswer,
  trackQuizComplete,
} from "@/lib/analytics/events";
import Container from "@/components/ui/Container";
import ProgressBar from "@/components/quiz/ProgressBar";
import OptionButton from "@/components/quiz/OptionButton";
import ResultCard from "@/components/sales/ResultCard";
import type { AnsweredQuestion, QuizOption } from "@/types/quiz";

const ADVANCE_MS = 200;
/** Pausa antes do resultado. Para voltar às pausas longas, aumente estes valores. */
const BETWEEN_QUESTIONS_MS = 0;
const CALCULATING_MS = 1500;

type Phase = "idle" | "thinking" | "calculating" | "done";

/**
 * Quiz embutido na página de venda: 5 perguntas, uma por vez, sem sair da página.
 * O botão de compra continua disponível em todo o resto da página.
 */
export default function InlineQuiz() {
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const rootRef = useRef<HTMLElement>(null);
  const seen = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !seen.current) {
          seen.current = true;
          trackQuizStart();
          trackQuizQuestionReached(1);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function handleSelect(option: QuizOption) {
    if (selectedId || phase !== "idle") return;
    haptic(12);
    const question = QUESTIONS[index];
    const next = [...answers.filter((a) => a.questionId !== question.id), { questionId: question.id, optionId: option.id }];
    setSelectedId(option.id);
    setAnswers(next);
    trackQuizAnswer(question.id);

    later(() => {
      const nextIndex = index + 1;
      if (nextIndex >= TOTAL_QUESTIONS) {
        setPhase("calculating");
        later(() => {
          trackQuizComplete();
          setPhase("done");
          haptic(30);
          later(() => rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
        }, CALCULATING_MS);
        return;
      }
      const go = () => {
        setIndex(nextIndex);
        setSelectedId(null);
        setPhase("idle");
        trackQuizQuestionReached(QUESTIONS[nextIndex].id);
      };
      if (BETWEEN_QUESTIONS_MS > 0) {
        setPhase("thinking");
        later(go, BETWEEN_QUESTIONS_MS);
      } else go();
    }, ADVANCE_MS);
  }

  const result = phase === "done" ? classifyAnswers(answers) : null;
  const question = QUESTIONS[index];

  return (
    <section id="quiz" ref={rootRef} className="scroll-mt-4 bg-ink py-12">
      <Container>
        <div className="rounded-3xl border border-gold/25 bg-ink-soft p-4 shadow-gold min-[380px]:p-5 sm:p-7">
          {result ? (
            <ResultCard profile={RESULT_PROFILES[result.profile] ?? RESULT_PROFILES.balanced} score={result.score} />
          ) : phase === "calculating" ? (
            <div className="flex min-h-[18rem] flex-col items-center justify-center gap-5 text-center">
              <span className="h-12 w-12 rounded-full border-2 border-white/10 border-t-gold-soft" style={{ animation: "think-spin 0.9s linear infinite" }} />
              <p className="font-display text-xl font-semibold text-paper">Lendo o seu padrão…</p>
              <style>{`@keyframes think-spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : (
            <div key={question.id} className="animate-q-in">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Descubra seu padrão · 30 segundos</p>
              <div className="mt-3 flex items-center gap-3">
                <ProgressBar value={index + 1} max={TOTAL_QUESTIONS} />
                <span className="w-9 shrink-0 text-right text-xs font-medium text-mist">
                  {index + 1}/{TOTAL_QUESTIONS}
                </span>
              </div>
              <h2 className="mt-5 text-balance font-display text-[1.5rem] font-semibold leading-[1.2] text-paper">
                {question.title}
              </h2>
              <div className="mt-5 flex flex-col gap-2" role="group" aria-label={question.title}>
                {question.options.map((option, i) => (
                  <OptionButton
                    key={option.id}
                    emoji={option.emoji}
                    label={option.label}
                    selected={selectedId === option.id}
                    dimmed={selectedId !== null && selectedId !== option.id}
                    disabled={selectedId !== null}
                    delay={40 + i * 40}
                    onSelect={() => handleSelect(option)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
