"use client";

import { ShieldCheck, Smartphone, Download, Lock } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import EbookCoverArt from "@/components/offer/EbookCoverArt";
import { PRODUCT_NAME, PRICE, PRICE_COMPARE, formatPrice } from "@/data/product";
import Reveal from "@/components/ui/Reveal";
import { startCheckout } from "@/lib/checkout/start";
import { haptic } from "@/lib/haptics";

const FEATURES = [
  "E-book digital com 6 módulos práticos.",
  "Leitura no celular ou no computador.",
  "Acesso imediato após o pagamento.",
  "Garantia de 7 dias.",
];

export default function PricingOffer() {
  function handleCheckoutClick() {
    haptic(15);
    startCheckout();
  }

  return (
    <section id="oferta" className="texture-grain relative overflow-hidden bg-ink py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 animate-drift rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(198,161,91,0.16), transparent)" }}
      />
      <Container>
        <Reveal y={28} className="relative overflow-hidden rounded-3xl border border-gold/25 bg-ink-soft p-6 shadow-gold sm:p-10">
          <SectionLabel className="relative">E-book digital</SectionLabel>
          <h2 className="relative mt-3 font-display text-3xl font-semibold text-paper">
            {PRODUCT_NAME}
          </h2>
          <p className="relative mt-1 text-base text-gold-soft">
            Como reativar o interesse sem parecer carente.
          </p>

          <div className="relative mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <EbookCoverArt className="w-40 shrink-0 sm:w-44" />

            <div className="flex w-full flex-col gap-6">
              <ul className="flex flex-col gap-2.5">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-paper sm:text-base">
                    <ShieldCheck size={16} className="shrink-0 text-gold" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline gap-3">
                {PRICE_COMPARE && PRICE_COMPARE > PRICE && (
                  <span className="text-base text-mist line-through">{formatPrice(PRICE_COMPARE)}</span>
                )}
                <span className="font-display text-3xl font-semibold text-gold-soft sm:text-4xl">
                  {formatPrice(PRICE)}
                </span>
              </div>

              <Button onClick={handleCheckoutClick} className="min-h-14 w-full">
                Quero acessar o guia
              </Button>

              <div className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/[0.07] p-3.5">
                <ShieldCheck size={22} className="mt-0.5 shrink-0 text-gold" />
                <p className="text-sm leading-snug text-paper">
                  <span className="font-semibold text-gold-soft">Garantia de 7 dias.</span> Não
                  gostou? Peça o reembolso pela plataforma.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-mist">
                <span className="flex items-center gap-1.5">
                  <Lock size={13} /> Pagamento seguro
                </span>
                <span className="flex items-center gap-1.5">
                  <Smartphone size={13} /> Acesso imediato
                </span>
                <span className="flex items-center gap-1.5">
                  <Download size={13} /> Garantia de 7 dias
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
