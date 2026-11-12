import { META_PIXEL_ID } from "@/data/product";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let initialized = false;

/**
 * Carrega o Meta Pixel seguindo fielmente a lógica do snippet oficial da
 * Meta (init do `fbq`, fila de chamadas antes do script carregar, depois
 * `fbevents.js` assume `window.fbq`), adaptada para: (1) só executar depois
 * que o visitante aceita o aviso de cookies (LGPD) e (2) nunca deixar uma
 * falha de carregamento (bloqueador de anúncios, offline) quebrar o quiz.
 */
export function loadMetaPixel(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;
  if (!META_PIXEL_ID) return;
  // Testes no computador não podem sujar o pixel de produção.
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(window.location.hostname)) return;

  try {
    initialized = true;

    (function (f: Window, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: Window["fbq"] = function (this: unknown, ...args: unknown[]) {
        const self = n as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[] };
        if (self.callMethod) {
          self.callMethod.apply(n, args);
        } else {
          self.queue.push(args);
        }
      };
      if (!f._fbq) f._fbq = n;
      (n as unknown as { push: typeof n }).push = n;
      (n as unknown as { loaded: boolean }).loaded = true;
      (n as unknown as { version: string }).version = "2.0";
      (n as unknown as { queue: unknown[] }).queue = [];
      f.fbq = n;

      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      t.onerror = () => {
        // Bloqueado por extensão/adblock ou falha de rede. Falha silenciosa.
      };
      const s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

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
