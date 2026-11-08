"use client";

import { ShieldCheck, Smartphone, Download, Lock } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import EbookCoverArt from "@/components/offer/EbookCoverArt";
import { PRODUCT_NAME, PRICE, PRICE_COMPARE, formatPrice } from "@/data/product";
import { buildCheckoutUrl } from "@/lib/checkout/kiwify";
import { captureUtmParams } from "@/lib/session";
import { trackInitiateCheckout } from "@/lib/analytics/events";

const FEATURES = [
  "E-book digital completo.",
  "Acesso após confirmação do pagamento.",
  "Leitura no celular ou computador.",
  "Garantia de 7 dias.",
];

export default function PricingOffer() {
  function handleCheckoutClick() {
    trackInitiateCheckout();
    const utm = captureUtmParams();
    const url = buildCheckoutUrl(utm);
    window.location.href = url;
  }

  return (
    <section id="oferta" className="texture-grain relative overflow-hidden bg-ink py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-[110px]"
      />
      <Container>
        <div className="rounded-3xl border border-gold/25 bg-ink-soft p-6 shadow-gold sm:p-10">
          <SectionLabel>Acesso digital</SectionLabel>
          <h2 className="mt-3 font-display text-2xl font-semibold text-paper sm:text-3xl">
            {PRODUCT_NAME}
          </h2>
          <p className="mt-1 text-sm text-mist sm:text-base">
            Seu próximo passo para se comunicar com mais segurança.
          </p>

          <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
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

              <Button onClick={handleCheckoutClick} className="w-full">
                Quero acessar o guia
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-mist">
                <span className="flex items-center gap-1.5">
                  <Lock size={13} /> Pagamento seguro
                </span>
                <span className="flex items-center gap-1.5">
                  <Smartphone size={13} /> Acesso digital
                </span>
                <span className="flex items-center gap-1.5">
                  <Download size={13} /> Garantia de 7 dias
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
