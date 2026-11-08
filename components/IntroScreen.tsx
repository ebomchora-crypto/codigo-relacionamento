"use client";

import { motion } from "framer-motion";
import { MessageCircleOff, Sparkles, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";

const INDICATORS = [
  { icon: Sparkles, label: "8 perguntas rápidas" },
  { icon: MessageCircleOff, label: "Resultado personalizado" },
  { icon: ShieldCheck, label: "Sem necessidade de cadastro" },
];

export default function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="texture-grain relative min-h-screen overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]"
      />
      <Container className="safe-top flex min-h-screen flex-col justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <SectionLabel>Análise de Comunicação Afetiva</SectionLabel>

          <h1 className="font-display text-[2rem] font-semibold leading-[1.15] text-paper sm:text-4xl">
            A pessoa esfriou... ou alguma coisa mudou entre vocês?
          </h1>

          <p className="max-w-md text-base leading-relaxed text-mist sm:text-lg">
            Responda 8 perguntas rápidas e descubra quais padrões de comunicação podem estar
            afetando sua tranquilidade emocional.
          </p>

          <ul className="mt-2 flex flex-col gap-3">
            {INDICATORS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-mist">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold">
                  <Icon size={16} />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={onStart} className="w-full sm:w-auto">
              Começar análise
            </Button>
            <p className="text-xs leading-relaxed text-mist/80">
              Uma experiência de autorreflexão. Não substitui avaliação psicológica.
            </p>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
