import Image from "next/image";
import { MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { TESTIMONIALS } from "@/data/testimonials";

/**
 * Prova social com prints reais de conversas enviadas por leitores — sem
 * nomes, fotos ou dados pessoais inventados ou expostos, e sem nenhuma nota,
 * contador ou percentual fabricado. Se um dia não houver nenhum print real
 * disponível, troque TESTIMONIALS por um array vazio e restaure o fallback
 * de prévia de conteúdo (ver histórico deste arquivo) em vez de inventar
 * depoimentos.
 */
export default function SocialProof() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="bg-ink-soft py-16 sm:py-20">
      <Container className="max-w-2xl">
        <Reveal>
          <SectionLabel>Prova social</SectionLabel>
          <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Experiências de quem já conheceu o guia
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mist">
            Prints reais de conversas enviadas por leitores, publicados com a identidade preservada.
          </p>
        </Reveal>
      </Container>

      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc((100%-220px)/2)] pb-4 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.src}
            className="relative shrink-0 snap-center overflow-hidden first:sm:ml-auto last:sm:mr-auto rounded-2xl border border-white/10 bg-ink shadow-card"
          >
            <div className="flex items-center gap-2 border-b border-white/10 bg-ink-soft px-3 py-2">
              <MessageCircle size={13} className="text-gold" />
              <span className="text-[11px] font-medium uppercase tracking-wide text-mist">
                Conversa real
              </span>
            </div>
            <Image
              src={testimonial.src}
              alt={testimonial.alt}
              width={testimonial.width}
              height={testimonial.height}
              className="h-auto w-[220px] sm:w-[240px]"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
