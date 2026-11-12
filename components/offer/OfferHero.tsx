"use client";

import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import EbookCoverArt from "@/components/offer/EbookCoverArt";
import { PRICE, formatPrice } from "@/data/product";
import { startCheckout } from "@/lib/checkout/start";
import { haptic } from "@/lib/haptics";

/**
 * Hero da oferta: problema, transformação e botão visíveis na primeira dobra
 * logo abaixo do resultado. Sem promessa de reconciliação.
 */
export default function OfferHero({ onQuiz }: { onQuiz?: () => void }) {
  return (
    <section className="bg-ink pb-10 pt-[max(2.5rem,env(safe-area-inset-top))]">
      <Container>
        <h1 className="text-balance font-display text-[1.7rem] font-semibold leading-[1.15] text-paper min-[380px]:text-[1.95rem]">
          A pessoa demora para responder. Você não precisa perder a paz por isso.
        </h1>
        <p className="mt-3 text-[1.02rem] leading-snug text-mist">
          Aprenda a lidar com o silêncio, segurar a vontade de mandar outra mensagem e conversar sem cobrança.
        </p>

        <div className="mt-6 flex items-center gap-4">
          <div className="w-28 shrink-0 min-[380px]:w-32">
            <EbookCoverArt />
          </div>
          <ul className="flex min-w-0 flex-col gap-2 text-[0.95rem] text-paper">
            {["E-book digital", "Leitura no celular", "Acesso imediato", "Garantia de 7 dias"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check size={15} strokeWidth={3} className="shrink-0 text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => {
            haptic(15);
            startCheckout();
          }}
          className="mt-6 min-h-14 w-full text-[1.05rem]"
        >
          Quero acessar o guia
        </Button>
        <p className="mt-2.5 text-center text-sm text-mist">
          <span className="font-semibold text-gold-soft">{formatPrice(PRICE)}</span> · pagamento seguro
        </p>
        {onQuiz && (
          <button
            type="button"
            onClick={onQuiz}
            className="focus-ring mx-auto mt-3 flex min-h-11 items-center justify-center text-[0.95rem] text-gold-soft underline decoration-gold/40 underline-offset-4"
          >
            Descobrir meu padrão em 30 segundos
          </button>
        )}
      </Container>
    </section>
  );
}
