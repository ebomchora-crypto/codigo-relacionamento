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
    <Container className="flex min-h-screen flex-col items-center justify-center py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <span className="h-px w-10 bg-gold" />
        <h2 className="font-display text-2xl font-semibold leading-snug text-paper sm:text-3xl">
          {screen.title}
        </h2>
        <p className="max-w-md text-balance text-base leading-relaxed text-mist">{screen.body}</p>
        <Button onClick={onContinue} className="mt-4">
          {screen.cta}
        </Button>
      </motion.div>
    </Container>
  );
}
