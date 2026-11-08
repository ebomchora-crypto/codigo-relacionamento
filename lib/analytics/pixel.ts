import { META_PIXEL_ID } from "@/data/product";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let initialized = false;

/**
 * Carrega o Meta Pixel manualmente (sem depender de scripts externos de
 * terceiros além do próprio SDK da Meta), de forma resiliente a
 * bloqueadores de rastreamento: qualquer falha de carregamento é silenciosa
 * e nunca impede o funcionamento do quiz.
 */
export function loadMetaPixel(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;
  if (!META_PIXEL_ID) return;

  try {
    initialized = true;

    if (!window.fbq) {
      const fbqFn = function (...args: unknown[]) {
        (fbqFn as unknown as { queue: unknown[] }).queue =
          (fbqFn as unknown as { queue: unknown[] }).queue || [];
        (fbqFn as unknown as { queue: unknown[] }).queue.push(args);
      };
      (fbqFn as unknown as { queue: unknown[] }).queue = [];
      (fbqFn as unknown as { loaded: boolean }).loaded = true;
      (fbqFn as unknown as { version: string }).version = "2.0";
      window.fbq = fbqFn as Window["fbq"];
      window._fbq = fbqFn;

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.onerror = () => {
        // Bloqueado por extensão/adblock. Falha silenciosa.
      };
      document.head.appendChild(script);
    }

    window.fbq?.("init", META_PIXEL_ID);
    window.fbq?.("track", "PageView");
  } catch {
    // Nunca deixar um erro de rastreamento quebrar a experiência.
  }
}

export function fbqTrack(event: string, params?: Record<string, unknown>, eventId?: string): void {
  if (typeof window === "undefined") return;
  try {
    if (!window.fbq) return;
    if (eventId) {
      window.fbq("track", event, params ?? {}, { eventID: eventId });
    } else {
      window.fbq("track", event, params ?? {});
    }
  } catch {
    // Falha silenciosa — bloqueador de rastreamento ou script não carregado.
  }
}

export function fbqTrackCustom(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("trackCustom", event, params ?? {});
  } catch {
    // Falha silenciosa.
  }
}
