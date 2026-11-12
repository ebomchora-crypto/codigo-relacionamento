"use client";

import { clearConsent } from "@/lib/analytics/consent";

/** Reabre o aviso de cookies; recarrega para descarregar o pixel se a pessoa tinha aceitado. */
export default function CookiePreferences() {
  return (
    <button
      type="button"
      onClick={() => {
        clearConsent();
        window.location.reload();
      }}
      className="focus-ring text-xs text-mist/70 underline underline-offset-2 hover:text-paper"
    >
      Preferências de cookies
    </button>
  );
}
