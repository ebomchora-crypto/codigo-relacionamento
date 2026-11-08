"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PRICE, formatPrice } from "@/data/product";
import { startCheckout } from "@/lib/checkout/start";
import { haptic } from "@/lib/haptics";

export default function StickyCta({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ bottom: "var(--consent-h, 0px)" }}
          className="fixed inset-x-0 z-40 border-t border-gold/20 bg-ink/90 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:hidden"
        >
          <div className="mx-auto flex max-w-2xl items-center gap-4 px-5">
            <div className="shrink-0 leading-tight">
              <p className="text-[11px] uppercase tracking-wide text-mist">Acesso digital</p>
              <p className="font-display text-lg font-semibold text-gold-soft">{formatPrice(PRICE)}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                haptic(15);
                startCheckout();
              }}
              className="btn-shine focus-ring min-h-12 flex-1 rounded-full bg-gold-fade px-5 text-sm font-semibold text-ink shadow-gold transition active:scale-[0.97]"
            >
              Quero acessar o guia
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
