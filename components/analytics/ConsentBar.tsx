"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getConsent, setConsent } from "@/lib/analytics/consent";
import { loadMetaPixel } from "@/lib/analytics/pixel";

function setConsentHeight(px: number) {
  document.documentElement.style.setProperty("--consent-h", `${px}px`);
}

export default function ConsentBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pending = getConsent() === null;
    setVisible(pending);
    if (!pending) setConsentHeight(0);
  }, []);

  useLayoutEffect(() => {
    if (!visible || !ref.current) return;
    const el = ref.current;
    const update = () => setConsentHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [visible]);

  function decide(state: "accepted" | "declined") {
    setConsent(state);
    if (state === "accepted") loadMetaPixel();
    setConsentHeight(0);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-label="Consentimento de cookies"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink-soft pb-[env(safe-area-inset-bottom)]"
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2">
            <p className="text-[11px] leading-snug text-mist sm:text-sm">
              Cookies para medir anúncios.
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => decide("declined")}
                className="focus-ring h-9 rounded-full border border-white/15 px-4 text-[13px] text-mist transition active:scale-95 hover:border-white/30 hover:text-paper"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="focus-ring h-9 rounded-full bg-gold-fade px-4 text-[13px] font-semibold text-ink transition active:scale-95 hover:opacity-90"
              >
                Aceitar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
