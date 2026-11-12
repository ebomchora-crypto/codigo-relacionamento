"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import QuizEngine, { type QuizResultPayload } from "@/components/quiz/QuizEngine";
import ResultsExperience from "@/components/ResultsExperience";
import type { Dimension, ScoreBreakdown } from "@/types/quiz";

type Stage = "quiz" | "result";

/**
 * O quiz começa direto na pergunta 1 (o gancho "visualizou e sumiu?" fica
 * no topo dela): um toque a menos entre o anúncio e a primeira resposta.
 */
export default function FunnelExperience() {
  const [stage, setStage] = useState<Stage>("quiz");
  const [profile, setProfile] = useState<Dimension>("balanced");
  const [score, setScore] = useState<ScoreBreakdown>({ anxiety: 0, limits: 0, communication: 0, balanced: 0 });

  function handleComplete(result: QuizResultPayload) {
    setProfile(result.profile);
    setScore(result.score);
    setStage("result");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  return (
    <MotionConfig reducedMotion="user">
      {stage === "quiz" ? (
        <QuizEngine onComplete={handleComplete} />
      ) : (
        <ResultsExperience profile={profile} score={score} />
      )}
    </MotionConfig>
  );
}
