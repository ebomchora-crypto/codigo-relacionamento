"use client";

import { Check, CreditCard, QrCode, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import EbookCoverArt from "@/components/offer/EbookCoverArt";
import { PRICE, formatPrice } from "@/data/product";
import { startCheckout } from "@/lib/checkout/start";
import { haptic } from "@/lib/haptics";

/**
 * Oferta logo abaixo do resultado, personalizada pelo padrão da pessoa:
 * problema, transformação, o que vem no guia e o botão de compra.
 */
export default function OfferHero({ patternName }: { patternName?: string }) {
  return (
    <section className="bg-ink pb-10 pt-4">
      <Container>
        {patternName && (
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.18em] text-gold" style={{ animationDelay: "700ms" }}>
            Indicado para o seu padrão: {patternName}
          </p>
        )}
        <h2 className="mt-2 animate-fade-up text-balance font-display text-[1.7rem] font-semibold leading-[1.15] text-paper min-[380px]:text-[1.95rem]" style={{ animationDelay: "780ms" }}>
          A pessoa demora para responder. Você não precisa perder a paz por isso.
        </h2>
        <p className="mt-3 animate-fade-up text-[1.02rem] leading-snug text-mist" style={{ animationDelay: "860ms" }}>
          Aprenda a lidar com o silêncio, segurar a vontade de mandar outra mensagem e conversar sem cobrança.
        </p>

        <div className="mt-6 flex animate-fade-up items-center gap-4" style={{ animationDelay: "940ms" }}>
          <div className="w-28 shrink-0 min-[380px]:w-32">
            <EbookCoverArt />
          </div>
          <ul className="flex min-w-0 flex-col gap-2 text-[0.95rem] text-paper">
            {["E-book digital", "Leitura no celular", "Acesso imediato", "Plano de 7 dias incluso"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check size={15} strokeWidth={3} className="shrink-0 text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 animate-fade-up" style={{ animationDelay: "1020ms" }}>
          <Button
            onClick={() => {
              haptic(15);
              startCheckout();
            }}
            className="min-h-14 w-full text-[1.05rem]"
          >
            Quero acessar o guia
          </Button>
          <p className="mt-2.5 text-center text-sm text-mist">
            <span className="text-base font-semibold text-gold-soft">{formatPrice(PRICE)}</span> · pagamento único
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-mist">
            <span className="flex items-center gap-1.5"><QrCode size={13} /> Pix</span>
            <span className="flex items-center gap-1.5"><CreditCard size={13} /> Cartão</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> 7 dias de garantia</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
