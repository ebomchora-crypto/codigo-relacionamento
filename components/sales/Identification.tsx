import { X } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

const SITUATIONS = [
  "A pessoa visualiza e fica horas sem responder.",
  "Você escreve, apaga e escreve de novo.",
  "Passa a noite olhando o “online” e relendo a conversa.",
];

/** Identificação: três situações em uma linha cada. */
export default function Identification() {
  return (
    <section className="bg-ink-soft py-12">
      <Container>
        <Reveal>
          <h2 className="font-display text-2xl font-semibold leading-tight text-paper">
            Se isso é a sua semana:
          </h2>
        </Reveal>
        <ul className="mt-6 flex flex-col gap-3">
          {SITUATIONS.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 0.08} y={14}>
              <div className="flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-400/20 text-red-300">
                  <X size={15} strokeWidth={3} />
                </span>
                <span className="text-[1.02rem] leading-snug text-paper">{item}</span>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.25}>
          <p className="mt-6 text-lg text-gold-soft">O guia foi feito para essa situação.</p>
        </Reveal>
      </Container>
    </section>
  );
}
