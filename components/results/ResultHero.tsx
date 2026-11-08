"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import AmbientBackground from "@/components/ui/AmbientBackground";
import PhotoBackdrop from "@/components/ui/PhotoBackdrop";
import WordReveal from "@/components/ui/WordReveal";
import Reveal from "@/components/ui/Reveal";
import type { ResultProfile } from "@/types/quiz";

export default function ResultHero({
  profile,
  onViewOffer,
}: {
  profile: ResultProfile;
  onViewOffer: () => void;
}) {
  const titleWords = profile.title.split(" ").length;
  const afterTitle = 0.5 + titleWords * 0.05;

  return (
    <section className="texture-grain relative overflow-hidden bg-ink py-14 sm:py-20">
      {profile.image && (
        <PhotoBackdrop
          photo={profile.image}
          className="inset-x-0 bottom-auto h-[26rem]"
          opacity={0.34}
        />
      )}
      <AmbientBackground />
      <Container className="relative">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <SectionLabel>Seu resultado personalizado</SectionLabel>
          <motion.span
            className="mt-3 block h-px bg-gold-fade"
            initial={{ width: 0 }}
            animate={{ width: 56 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        <h1 className="mt-5 text-balance font-display text-[1.75rem] font-semibold leading-[1.2] text-paper sm:text-4xl">
          <WordReveal text={profile.title} delay={0.5} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: afterTitle }}
          className="mt-5 text-base leading-relaxed text-mist sm:text-lg"
        >
          {profile.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: afterTitle + 0.3 }}
          className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-card backdrop-blur-sm sm:p-8"
        >
          <h2 className="font-display text-lg font-semibold text-gold-soft">
            O que você pode fazer a partir de agora?
          </h2>
          <ol className="mt-5 flex flex-col gap-4">
            {profile.recommendations.map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: afterTitle + 0.7 + index * 0.18 }}
                className="flex gap-4 text-sm leading-relaxed text-paper sm:text-base"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/5 text-xs font-semibold text-gold">
                  {index + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        <Reveal className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-10">
          <h3 className="text-balance font-display text-xl font-semibold leading-snug text-paper sm:text-2xl">
            Entender o que acontece é o primeiro passo. Aprender a agir é o próximo.
          </h3>
          <p className="text-base leading-relaxed text-mist">
            Você pode desenvolver uma forma mais tranquila e segura de lidar com conversas
            difíceis, afastamentos e expectativas.
          </p>
          <Button onClick={onViewOffer} className="min-h-14 w-full sm:w-auto">
            Conhecer o guia
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
