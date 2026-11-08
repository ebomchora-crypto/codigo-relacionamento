import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import { PRODUCT_MODULES } from "@/data/modules";

/**
 * Enquanto não existirem depoimentos reais e verificados, esta seção exibe
 * uma prévia honesta do conteúdo do guia em vez de avaliações fictícias —
 * conforme exigido na especificação do produto. Quando depoimentos reais
 * existirem, substitua este componente por um carrossel de cards com nome,
 * identificação autorizada e, opcionalmente, nota/foto — nunca inventados.
 */
export default function SocialProof() {
  return (
    <section className="bg-ink-soft py-16 sm:py-20">
      <Container>
        <SectionLabel>Prévia do conteúdo</SectionLabel>
        <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Um primeiro olhar sobre o que você vai estudar
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          Ainda não publicamos depoimentos de leitores — preferimos esperar por avaliações reais e
          verificadas a inventar números. Por enquanto, veja um resumo direto de cada módulo do
          guia.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {PRODUCT_MODULES.map((module) => (
            <div
              key={module.number}
              className="rounded-2xl border border-white/10 bg-ink p-5 shadow-card"
            >
              <span className="font-display text-xs text-gold">Módulo {module.number}</span>
              <h3 className="mt-2 font-display text-base font-semibold text-paper">{module.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{module.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
