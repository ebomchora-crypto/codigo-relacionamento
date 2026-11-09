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
          <h2 className="font-display text-2xl font-semibold leading-tight text-paper">
            O que você vai saber fazer
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
                    <p className="text-[1.02rem] font-medium leading-snug text-paper">{m.description}</p>
                    <p className="mt-1 text-xs text-mist">
                      <span className="text-gold">Módulo {m.number}</span> · {m.title}
                    </p>
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
