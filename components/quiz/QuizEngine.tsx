"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";
import QuestionCard from "@/components/quiz/QuestionCard";
import TransitionLoader from "@/components/quiz/TransitionLoader";
import ThinkingLoader from "@/components/quiz/ThinkingLoader";
import { classifyAnswers } from "@/lib/scoring/engine";
import { loadQuizState, saveQuizState, clearQuizState, captureUtmParams } from "@/lib/session";
import {
  trackQuizStart,
  trackQuizQuestionReached,
  trackQuizAnswer,
  trackQuizComplete,
} from "@/lib/analytics/events";
import type { AnsweredQuestion, Dimension, QuizOption, ScoreBreakdown } from "@/types/quiz";

type Phase =
  | { type: "question"; questionIndex: number }
  | { type: "thinking"; nextIndex: number }
  | { type: "transition" };

/** Pausa de 3s entre uma pergunta e outra, com mensagem própria de cada etapa. */
export const THINKING_MS = 3000;
const THINKING_MESSAGES: string[][] = [
  ["Analisando sua reação…", "Comparando com outros perfis…", "Anotando seu padrão…"],
  ["Lendo o que passa na sua cabeça…", "Procurando o que se repete…", "Quase lá…"],
  ["Entendendo seus momentos de silêncio…", "Cruzando com suas respostas…", "Anotando…"],
  ["Vendo como você reage ao afastamento…", "Medindo seus limites…", "Falta só uma…"],
];

export interface QuizResultPayload {
  answers: AnsweredQuestion[];
  profile: Dimension;
  score: ScoreBreakdown;
}

export default function QuizEngine({ onComplete }: { onComplete: (result: QuizResultPayload) => void }) {
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>({ type: "question", questionIndex: 0 });
  const startedTracked = useRef(false);
  const reachedTracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const persisted = loadQuizState();
    if (persisted && persisted.answers.length > 0 && persisted.currentIndex < TOTAL_QUESTIONS) {
      setAnswers(persisted.answers);
      setQuestionIndex(persisted.currentIndex);
      setPhase({ type: "question", questionIndex: persisted.currentIndex });
    }
    if (!startedTracked.current) {
      startedTracked.current = true;
      trackQuizStart();
    }
  }, []);

  useEffect(() => {
    if (phase.type !== "question") return;
    const question = QUESTIONS[phase.questionIndex];
    if (!question) return;
    if (!reachedTracked.current.has(question.id)) {
      reachedTracked.current.add(question.id);
      trackQuizQuestionReached(question.id);
    }
  }, [phase]);

  function persist(nextAnswers: AnsweredQuestion[], nextIndex: number) {
    saveQuizState({
      answers: nextAnswers,
      currentIndex: nextIndex,
      startedAt: Date.now(),
      utm: captureUtmParams(),
    });
  }

  function handleAnswer(option: QuizOption) {
    const question = QUESTIONS[questionIndex];
    const nextAnswers = [
      ...answers.filter((a) => a.questionId !== question.id),
      { questionId: question.id, optionId: option.id },
    ];
    setAnswers(nextAnswers);
    trackQuizAnswer(question.id);

    const nextIndex = questionIndex + 1;
    persist(nextAnswers, nextIndex);

    advanceToIndex(nextIndex);
  }

  function advanceToIndex(nextIndex: number) {
    if (nextIndex >= TOTAL_QUESTIONS) {
      setPhase({ type: "transition" });
      return;
    }
    setPhase({ type: "thinking", nextIndex });
  }

  function handleThinkingDone() {
    if (phase.type !== "thinking") return;
    const nextIndex = phase.nextIndex;
    setQuestionIndex(nextIndex);
    setPhase({ type: "question", questionIndex: nextIndex });
  }

  function handleBack() {
    if (phase.type !== "question" || questionIndex === 0) return;
    const prevIndex = questionIndex - 1;
    setQuestionIndex(prevIndex);
    setPhase({ type: "question", questionIndex: prevIndex });
    persist(answers, prevIndex);
  }

  function handleTransitionDone() {
    trackQuizComplete();
    clearQuizState();
    const { profile, score } = classifyAnswers(answers);
    onComplete({ answers, profile, score });
  }

  const phaseKey =
    phase.type === "question"
      ? `q-${QUESTIONS[phase.questionIndex].id}`
      : phase.type === "thinking"
        ? `t-${phase.nextIndex}`
        : "transition";

  return (
    <div key={phaseKey} className="min-h-dvh overflow-x-hidden bg-ink">
      {phase.type === "question" ? (
        <QuestionCard
          question={QUESTIONS[phase.questionIndex]}
          index={phase.questionIndex + 1}
          total={TOTAL_QUESTIONS}
          canGoBack={phase.questionIndex > 0}
          onBack={handleBack}
          onAnswer={handleAnswer}
        />
      ) : phase.type === "thinking" ? (
        <ThinkingLoader
          durationMs={THINKING_MS}
          messages={THINKING_MESSAGES[Math.min(phase.nextIndex - 1, THINKING_MESSAGES.length - 1)]}
          onDone={handleThinkingDone}
        />
      ) : (
        <TransitionLoader onDone={handleTransitionDone} />
      )}
    </div>
  );
}
