"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/analytics/consent";
import { loadMetaPixel } from "@/lib/analytics/pixel";

export default function ConsentBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink-soft/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-mist">
          Usamos cookies e tecnologias de medição para melhorar sua experiência e entender o
          resultado das nossas campanhas. Você pode aceitar ou recusar.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              setConsent("declined");
              setVisible(false);
            }}
            className="focus-ring rounded-full border border-white/15 px-4 py-2 text-sm text-mist transition hover:border-white/30 hover:text-paper"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => {
              setConsent("accepted");
              loadMetaPixel();
              setVisible(false);
            }}
            className="focus-ring rounded-full bg-gold-fade px-4 py-2 text-sm font-semibold text-ink transition hover:opacity-90"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
