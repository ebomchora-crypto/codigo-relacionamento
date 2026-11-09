"use client";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { PRICE, formatPrice } from "@/data/product";
import { startCheckout } from "@/lib/checkout/start";
import { haptic } from "@/lib/haptics";

/** Fecha a página: uma última chance de ir para o checkout, sem texto extra. */
export default function FinalCta() {
  return (
    <section className="bg-ink py-12">
      <Container className="text-center">
        <p className="font-display text-2xl font-semibold leading-snug text-paper">
          Da próxima vez que a pessoa demorar, você pode agir diferente.
        </p>
        <Button
          onClick={() => {
            haptic(15);
            startCheckout();
          }}
          className="mt-6 min-h-14 w-full"
        >
          Quero acessar o guia
        </Button>
        <p className="mt-3 text-sm text-mist">{formatPrice(PRICE)} · Acesso imediato · Garantia de 7 dias</p>
      </Container>
    </section>
  );
}
