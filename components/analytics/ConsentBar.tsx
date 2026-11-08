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
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink-soft/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-mist sm:text-sm">
              Usamos cookies para medir campanhas e melhorar sua experiência. Você pode aceitar ou
              recusar.
            </p>
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => decide("declined")}
                className="focus-ring h-10 rounded-full border border-white/15 px-5 text-sm text-mist transition active:scale-95 hover:border-white/30 hover:text-paper"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="focus-ring h-10 rounded-full bg-gold-fade px-5 text-sm font-semibold text-ink transition active:scale-95 hover:opacity-90"
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
