"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { QuizQuestion, QuizOption } from "@/types/quiz";
import ProgressBar from "@/components/quiz/ProgressBar";
import OptionButton from "@/components/quiz/OptionButton";
import Container from "@/components/ui/Container";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { haptic } from "@/lib/haptics";

const ADVANCE_DELAY_MS = 320;

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

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

  function handleSelect(option: QuizOption) {
    if (selectedId) return;
    haptic(12);
    setSelectedId(option.id);
    timer.current = window.setTimeout(() => onAnswer(option), ADVANCE_DELAY_MS);
  }

  return (
    <div className="texture-grain relative min-h-dvh overflow-hidden bg-ink">
      <AmbientBackground />

      <Container className="pb-consent relative flex min-h-dvh flex-col pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            aria-label="Voltar para a pergunta anterior"
            className="focus-ring -ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-mist transition active:scale-90 hover:text-paper disabled:opacity-0"
          >
            <ChevronLeft size={22} />
          </button>
          <ProgressBar value={index} max={total} />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-mist"
          >
            Pergunta <span className="text-gold-soft">{index}</span> de {total}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-balance font-display text-[1.65rem] font-semibold leading-[1.2] text-paper sm:text-3xl"
          >
            {question.title}
          </motion.h1>
        </div>

        <motion.div
          variants={list}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
          role="group"
          aria-label={question.title}
        >
          {question.options.map((option) => (
            <motion.div key={option.id} variants={item}>
              <OptionButton
                letter={option.id}
                label={option.label}
                selected={selectedId === option.id}
                disabled={selectedId !== null}
                onSelect={() => handleSelect(option)}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
