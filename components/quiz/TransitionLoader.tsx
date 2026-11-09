"use client";

import ThinkingLoader from "@/components/quiz/ThinkingLoader";

export const RESULT_DELAY_MS = 6000;

const STEPS = [
  "Lendo suas 5 respostas",
  "Cruzando seus padrões",
  "Medindo ansiedade e limites",
  "Montando seu resultado",
];

/** Cálculo final: 6 segundos com etapas visíveis. */
export default function TransitionLoader({ onDone }: { onDone: () => void }) {
  return (
    <ThinkingLoader
      durationMs={RESULT_DELAY_MS}
      messages={STEPS}
      title="Calculando seu padrão"
      checklist
      onDone={onDone}
    />
  );
}
