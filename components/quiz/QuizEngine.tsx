"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";
import { ENGAGEMENT_SCREENS } from "@/data/engagement-screens";
import QuestionCard from "@/components/quiz/QuestionCard";
import EngagementScreenView from "@/components/quiz/EngagementScreenView";
import TransitionLoader from "@/components/quiz/TransitionLoader";
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
  | { type: "engagement"; afterQuestionId: number; questionIndex: number }
  | { type: "transition" };

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d * 36 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -36 }),
};

export interface QuizResultPayload {
  answers: AnsweredQuestion[];
  profile: Dimension;
  score: ScoreBreakdown;
}

export default function QuizEngine({ onComplete }: { onComplete: (result: QuizResultPayload) => void }) {
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>({ type: "question", questionIndex: 0 });
  const direction = useRef<1 | -1>(1);
  const startedTracked = useRef(false);
  const reachedTracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const persisted = loadQuizState();
    if (persisted && persisted.answers.length > 0) {
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
    direction.current = 1;
    setAnswers(nextAnswers);
    trackQuizAnswer(question.id);

    const nextIndex = questionIndex + 1;
    persist(nextAnswers, nextIndex);

    const engagement = ENGAGEMENT_SCREENS.find((s) => s.afterQuestionId === question.id);

    if (engagement) {
      setPhase({ type: "engagement", afterQuestionId: question.id, questionIndex: nextIndex });
      return;
    }

    advanceToIndex(nextIndex, nextAnswers);
  }

  function advanceToIndex(nextIndex: number, currentAnswers: AnsweredQuestion[]) {
    if (nextIndex >= TOTAL_QUESTIONS) {
      setPhase({ type: "transition" });
      return;
    }
    setQuestionIndex(nextIndex);
    setPhase({ type: "question", questionIndex: nextIndex });
    void currentAnswers;
  }

  function handleEngagementContinue() {
    if (phase.type !== "engagement") return;
    direction.current = 1;
    advanceToIndex(phase.questionIndex, answers);
  }

  function handleBack() {
    if (phase.type !== "question" || questionIndex === 0) return;
    direction.current = -1;
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

  const engagement =
    phase.type === "engagement"
      ? ENGAGEMENT_SCREENS.find((s) => s.afterQuestionId === phase.afterQuestionId)
      : undefined;

  const phaseKey =
    phase.type === "question"
      ? `q-${QUESTIONS[phase.questionIndex].id}`
      : phase.type === "engagement"
        ? `e-${phase.afterQuestionId}`
        : "transition";

  return (
    <div className="min-h-dvh overflow-x-hidden bg-ink">
      <AnimatePresence mode="wait" custom={direction.current} initial={false}>
        <motion.div
          key={phaseKey}
          custom={direction.current}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {phase.type === "question" && (
            <QuestionCard
              question={QUESTIONS[phase.questionIndex]}
              index={phase.questionIndex + 1}
              total={TOTAL_QUESTIONS}
              canGoBack={phase.questionIndex > 0}
              onBack={handleBack}
              onAnswer={handleAnswer}
            />
          )}
          {phase.type === "engagement" && engagement && (
            <EngagementScreenView screen={engagement} onContinue={handleEngagementContinue} />
          )}
          {phase.type === "transition" && <TransitionLoader onDone={handleTransitionDone} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
