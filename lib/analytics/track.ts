import type { TrackedEventType } from "@/lib/analytics/store";

const SESSION_ID_KEY = "ocds:session-id:v1";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = window.sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `sid_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return `sid_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

function getCampaign(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return new URLSearchParams(window.location.search).get("utm_campaign") ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Envia um evento interno (agregado, sem dados pessoais) para o endpoint
 * /api/track, que alimenta o painel administrativo em /admin.
 * Falha silenciosamente: nunca deve impedir o uso do quiz.
 */
export function trackInternal(type: TrackedEventType, questionId?: number): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      type,
      sessionId: getOrCreateSessionId(),
      questionId,
      utmCampaign: getCampaign(),
    });

    if ("sendBeacon" in navigator) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
      return;
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Falha silenciosa.
  }
}

export { getOrCreateSessionId };
