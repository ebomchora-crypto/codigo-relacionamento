"use client";

import { motion } from "framer-motion";
import { MessageCircleOff, Sparkles, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import AmbientBackground from "@/components/ui/AmbientBackground";
import PhotoBackdrop from "@/components/ui/PhotoBackdrop";
import SignalArt from "@/components/ui/SignalArt";
import WordReveal from "@/components/ui/WordReveal";
import { haptic } from "@/lib/haptics";

const INDICATORS = [
  { icon: Sparkles, label: "8 perguntas rápidas" },
  { icon: MessageCircleOff, label: "Resultado personalizado" },
  { icon: ShieldCheck, label: "Sem necessidade de cadastro" },
];

const HEADLINE = "A pessoa esfriou... ou alguma coisa mudou entre vocês?";

export default function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="texture-grain relative min-h-dvh overflow-hidden bg-ink">
      <PhotoBackdrop
        photo={{ src: "/images/phone-candle.jpg", position: "78% 50%" }}
        className="inset-x-0 bottom-auto h-[46%]"
        opacity={0.42}
        priority
      />
      <AmbientBackground />
      <Container className="pb-consent relative flex min-h-dvh flex-col pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="flex flex-1 flex-col justify-center gap-5 py-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <SignalArt className="mx-auto h-[min(17dvh,8rem)] w-auto max-w-full" />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <SectionLabel>Análise de Comunicação Afetiva</SectionLabel>
          </motion.div>

          <h1 className="text-balance font-display text-[1.75rem] font-semibold leading-[1.15] text-paper min-[380px]:text-[1.95rem] sm:text-4xl">
            <WordReveal text={HEADLINE} delay={0.45} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="max-w-md text-base leading-relaxed text-mist sm:text-lg"
          >
            Responda 8 perguntas rápidas e descubra quais padrões de comunicação podem estar
            afetando sua tranquilidade emocional.
          </motion.p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
            {INDICATORS.map(({ icon: Icon, label }, i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.5 + i * 0.12 }}
                className="flex items-center gap-2 text-[13px] text-mist"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold">
                  <Icon size={13} />
                </span>
                {label}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="flex flex-col gap-3 pt-4"
        >
          <Button
            onClick={() => {
              haptic(15);
              onStart();
            }}
            className="w-full min-h-14 sm:w-auto"
          >
            Começar análise
          </Button>
          <p className="text-xs leading-relaxed text-mist/80">
            Uma experiência de autorreflexão. Não substitui avaliação psicológica.
          </p>
        </motion.div>
      </Container>
    </div>
  );
}
