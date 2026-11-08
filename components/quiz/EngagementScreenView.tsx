"use client";

import { motion } from "framer-motion";
import type { EngagementScreen } from "@/types/quiz";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function EngagementScreenView({
  screen,
  onContinue,
}: {
  screen: EngagementScreen;
  onContinue: () => void;
}) {
  return (
    <div className="texture-grain relative min-h-screen overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[110px]"
      />
      <Container className="relative flex min-h-screen flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <span className="h-px w-10 bg-gold-fade" />
          <h2 className="font-display text-2xl font-semibold leading-snug text-paper sm:text-3xl">
            {screen.title}
          </h2>
          <p className="max-w-md text-balance text-base leading-relaxed text-mist">{screen.body}</p>
          <Button onClick={onContinue} className="mt-4">
            {screen.cta}
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
