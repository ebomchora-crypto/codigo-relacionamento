"use client";

import { motion } from "framer-motion";
import type { EngagementScreen } from "@/types/quiz";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AmbientBackground from "@/components/ui/AmbientBackground";
import PulseOrb from "@/components/ui/PulseOrb";
import WordReveal from "@/components/ui/WordReveal";

export default function EngagementScreenView({
  screen,
  onContinue,
}: {
  screen: EngagementScreen;
  onContinue: () => void;
}) {
  const titleWords = screen.title.split(" ").length;
  const bodyDelay = 0.35 + titleWords * 0.045;

  return (
    <div className="texture-grain relative min-h-dvh overflow-hidden bg-ink">
      <AmbientBackground position="center" />
      <Container className="pb-consent relative flex min-h-dvh flex-col pt-[max(1.25rem,env(safe-area-inset-top))] text-center">
        <div className="flex flex-1 flex-col items-center justify-center gap-7 py-8">
          <PulseOrb />
          <h2 className="text-balance font-display text-[1.65rem] font-semibold leading-snug text-paper sm:text-3xl">
            <WordReveal text={screen.title} delay={0.3} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: bodyDelay }}
            className="max-w-md text-balance text-base leading-relaxed text-mist"
          >
            {screen.body}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: bodyDelay + 0.35 }}
        >
          <Button onClick={onContinue} className="w-full sm:w-auto">
            {screen.cta}
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
