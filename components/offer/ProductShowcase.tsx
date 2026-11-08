import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
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

        <Reveal y={24} className="mt-8">
          <figure className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 shadow-card sm:aspect-[2/1]">
            <Image
              src="/images/reading-book.jpg"
              alt="Livro aberto com óculos ao lado de uma lanterna acesa"
              fill
              sizes="(min-width: 672px) 624px, 100vw"
              quality={60}
              className="object-cover"
              style={{ objectPosition: "50% 55%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 font-display text-sm text-gold-soft sm:text-base">
              Leitura no seu ritmo, sem pressa.
            </figcaption>
          </figure>
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
