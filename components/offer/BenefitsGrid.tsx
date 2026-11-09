import {
  TriangleAlert,
  Snowflake,
  Hourglass,
  MessageCircleHeart,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { PRODUCT_MODULES } from "@/data/modules";

const ICONS: LucideIcon[] = [TriangleAlert, Snowflake, Hourglass, MessageCircleHeart, Scale, ShieldCheck];

/** Os 6 módulos sempre visíveis (cartões), em vez de acordeão escondido. */
export default function BenefitsGrid() {
  return (
    <section className="bg-ink-soft py-12">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Dentro do guia</p>
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-paper">
            6 passos para parar de agir no impulso
          </h2>
        </Reveal>

        <div className="mt-6 grid gap-3 min-[560px]:grid-cols-2">
          {PRODUCT_MODULES.map((m, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={m.number} delay={(i % 2) * 0.06} y={14}>
                <div className="flex h-full gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <Icon size={22} />
                  </span>
                  <div>
                    <p className="font-display text-[1.05rem] font-semibold leading-tight text-paper">
                      <span className="mr-1.5 text-sm text-gold">{m.number}</span>
                      {m.title}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-mist">{m.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
