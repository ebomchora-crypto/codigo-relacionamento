"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
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

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stage}
          initial={{ opacity: 0, scale: stage === "result" ? 1 : 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {stage === "intro" && <IntroScreen onStart={() => setStage("quiz")} />}
          {stage === "quiz" && <QuizEngine onComplete={handleComplete} />}
          {stage === "result" && <ResultsExperience profile={profile} />}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
