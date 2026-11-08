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
    advanceToIndex(phase.questionIndex, answers);
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

  return (
    <div className="texture-grain min-h-screen bg-ink">
      <AnimatePresence mode="wait">
        {phase.type === "question" && (
          <motion.div
            key={`q-${QUESTIONS[phase.questionIndex].id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <QuestionCard
              question={QUESTIONS[phase.questionIndex]}
              index={phase.questionIndex + 1}
              total={TOTAL_QUESTIONS}
              canGoBack={phase.questionIndex > 0}
              onBack={handleBack}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}

        {phase.type === "engagement" &&
          (() => {
            const screen = ENGAGEMENT_SCREENS.find((s) => s.afterQuestionId === phase.afterQuestionId);
            if (!screen) return null;
            return (
              <motion.div
                key={`engagement-${phase.afterQuestionId}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <EngagementScreenView screen={screen} onContinue={handleEngagementContinue} />
              </motion.div>
            );
          })()}

        {phase.type === "transition" && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TransitionLoader onDone={handleTransitionDone} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
