import { X } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import type { ResultProfile } from "@/types/quiz";

/** "Se nada mudar": 3 itens do seu padrão, em formato de lista escaneável. */
export default function PainBridge({ profile }: { profile: ResultProfile }) {
  return (
    <section className="bg-ink-soft py-12">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {profile.name}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-paper">
            Se nada mudar, isso continua:
          </h2>
        </Reveal>
        <ul className="mt-6 flex flex-col gap-3">
          {profile.costs.map((item, i) => (
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
        <Reveal delay={0.3}>
          <p className="mt-6 font-display text-lg text-gold-soft">
            Não é falta de sorte. É falta de método.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
