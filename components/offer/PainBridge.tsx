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
          <h2 className="font-display text-2xl font-semibold leading-tight text-paper">
            Isso descreve o que você vive?
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
      </Container>
    </section>
  );
}
