"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { QuizQuestion, QuizOption } from "@/types/quiz";
import ProgressBar from "@/components/quiz/ProgressBar";
import OptionButton from "@/components/quiz/OptionButton";
import HookBanner from "@/components/quiz/HookBanner";
import Container from "@/components/ui/Container";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { haptic } from "@/lib/haptics";

const ADVANCE_DELAY_MS = 200;

export default function QuestionCard({
  question,
  index,
  total,
  canGoBack,
  onBack,
  onAnswer,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  canGoBack: boolean;
  onBack: () => void;
  onAnswer: (option: QuizOption) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  function handleSelect(option: QuizOption) {
    if (selectedId) return;
    haptic(12);
    setSelectedId(option.id);
    timer.current = window.setTimeout(() => onAnswer(option), ADVANCE_DELAY_MS);
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink">
      <AmbientBackground />
      <Container className="pb-consent relative flex min-h-dvh animate-q-in flex-col pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            aria-label="Voltar para a pergunta anterior"
            className="focus-ring -ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-mist transition active:scale-90 disabled:opacity-0"
          >
            <ChevronLeft size={22} />
          </button>
          <ProgressBar value={index} max={total} />
          <span className="w-9 shrink-0 text-right text-xs font-medium text-mist">
            {index}/{total}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-3 py-2">
          {index === 1 && <HookBanner />}
          <h1 className="text-balance font-display text-[1.5rem] font-semibold leading-[1.2] text-paper min-[380px]:text-[1.8rem] sm:text-3xl">
            {question.title}
          </h1>
        </div>

        <div className="flex flex-col gap-2" role="group" aria-label={question.title}>
          {question.options.map((option, i) => (
            <OptionButton
              key={option.id}
              emoji={option.emoji}
              label={option.label}
              selected={selectedId === option.id}
              dimmed={selectedId !== null && selectedId !== option.id}
              disabled={selectedId !== null}
              delay={60 + i * 45}
              onSelect={() => handleSelect(option)}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
