"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import type { ResultProfile } from "@/types/quiz";

export default function ResultHero({
  profile,
  onViewOffer,
}: {
  profile: ResultProfile;
  onViewOffer: () => void;
}) {
  return (
    <section className="texture-grain relative overflow-hidden bg-ink py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-1/2 h-96 w-96 translate-x-1/2 rounded-full bg-gold/10 blur-[100px]"
      />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionLabel>Seu resultado personalizado</SectionLabel>

          <h1 className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.2] text-paper sm:text-4xl">
            {profile.title}
          </h1>

          <p className="mt-5 text-base leading-relaxed text-mist sm:text-lg">{profile.body}</p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-ink-soft p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-gold-soft">
              O que você pode fazer a partir de agora?
            </h2>
            <ol className="mt-5 flex flex-col gap-4">
              {profile.recommendations.map((item, index) => (
                <li key={item} className="flex gap-4 text-sm leading-relaxed text-paper sm:text-base">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 text-xs font-semibold text-gold">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-10">
            <h3 className="font-display text-xl font-semibold leading-snug text-paper sm:text-2xl">
              Entender o que acontece é o primeiro passo. Aprender a agir é o próximo.
            </h3>
            <p className="text-base leading-relaxed text-mist">
              Você pode desenvolver uma forma mais tranquila e segura de lidar com conversas
              difíceis, afastamentos e expectativas.
            </p>
            <Button onClick={onViewOffer} className="w-full sm:w-auto">
              Conhecer o guia
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
