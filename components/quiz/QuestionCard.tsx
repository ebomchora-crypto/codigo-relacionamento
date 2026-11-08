"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { QuizQuestion, QuizOption } from "@/types/quiz";
import ProgressBar from "@/components/quiz/ProgressBar";
import OptionButton from "@/components/quiz/OptionButton";
import Container from "@/components/ui/Container";

const ADVANCE_DELAY_MS = 250;

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

  function handleSelect(option: QuizOption) {
    if (selectedId) return;
    setSelectedId(option.id);
    window.setTimeout(() => {
      onAnswer(option);
    }, ADVANCE_DELAY_MS);
  }

  return (
    <div className="texture-grain relative min-h-screen overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[110px]"
      />

      <Container className="safe-top relative flex min-h-screen flex-col py-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            aria-label="Voltar para a pergunta anterior"
            className="focus-ring -ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mist transition hover:text-paper disabled:opacity-0"
          >
            <ChevronLeft size={20} />
          </button>
          <ProgressBar value={index} max={total} />
        </div>

        <p className="mt-4 text-sm font-medium text-mist">
          Pergunta <span className="text-gold-soft">{index}</span> de {total}
        </p>

        <motion.h1
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-8 font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl"
        >
          {question.title}
        </motion.h1>

        <motion.div
          key={`options-${question.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-8 flex flex-1 flex-col gap-3"
          role="group"
          aria-label={question.title}
        >
          {question.options.map((option) => (
            <OptionButton
              key={option.id}
              letter={option.id}
              label={option.label}
              selected={selectedId === option.id}
              disabled={selectedId !== null}
              onSelect={() => handleSelect(option)}
            />
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
