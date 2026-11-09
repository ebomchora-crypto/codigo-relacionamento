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
          O silêncio não precisa decidir por você.
        </p>
        <Button
          onClick={() => {
            haptic(15);
            startCheckout();
          }}
          className="mt-6 min-h-14 w-full"
        >
          Quero o guia por {formatPrice(PRICE)}
        </Button>
        <p className="mt-3 text-xs text-mist">Pagamento seguro · Acesso imediato · Garantia de 7 dias</p>
      </Container>
    </section>
  );
}
