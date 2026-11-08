import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import EbookCoverArt from "@/components/offer/EbookCoverArt";
import { PRODUCT_BENEFITS } from "@/data/modules";

export default function ProductShowcase() {
  return (
    <section className="bg-ink-soft py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionLabel>Conheça o Código do Silêncio</SectionLabel>

          <h2 className="mt-4 text-balance font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Aprenda a lidar com o afastamento sem perder sua tranquilidade.
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-12">
          <Reveal y={30} className="w-full sm:w-1/2 sm:shrink-0">
            <EbookCoverArt />
          </Reveal>

          <div className="flex flex-col gap-6">
            <p className="text-base leading-relaxed text-mist">
              Um guia prático sobre comunicação, inteligência emocional e relacionamentos, criado
              para quem deseja parar de agir por ansiedade e começar a se posicionar com mais
              confiança.
            </p>

            <ul className="flex flex-col gap-3">
              {PRODUCT_BENEFITS.map((benefit, i) => (
                <Reveal as="li" delay={i * 0.07} y={12} key={benefit} className="flex items-start gap-3 text-sm text-paper sm:text-base">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {benefit}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
