"use client";

import { useState } from "react";
import IntroScreen from "@/components/IntroScreen";
import QuizEngine, { type QuizResultPayload } from "@/components/quiz/QuizEngine";
import ResultsExperience from "@/components/ResultsExperience";
import type { Dimension } from "@/types/quiz";

type Stage = "intro" | "quiz" | "result";

export default function FunnelExperience() {
  const [stage, setStage] = useState<Stage>("intro");
  const [profile, setProfile] = useState<Dimension>("balanced");

  function handleComplete(result: QuizResultPayload) {
    setProfile(result.profile);
    setStage("result");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  if (stage === "intro") {
    return <IntroScreen onStart={() => setStage("quiz")} />;
  }

  if (stage === "quiz") {
    return <QuizEngine onComplete={handleComplete} />;
  }

  return <ResultsExperience profile={profile} />;
}
