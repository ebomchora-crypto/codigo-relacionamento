import { fbqTrack, fbqTrackCustom } from "@/lib/analytics/pixel";
import { trackInternal, getOrCreateSessionId } from "@/lib/analytics/track";
import { getConsent } from "@/lib/analytics/consent";

/**
 * Camada única de eventos de analytics usada pelos componentes.
 *
 * - O Meta Pixel só dispara quando o consentimento foi aceito (ver
 *   components/ConsentBar.tsx), respeitando LGPD.
 * - O rastreamento interno (para o painel /admin) é agregado e não contém
 *   nenhuma resposta pessoal do quiz — apenas o número da pergunta em que o
 *   visitante está, para calcular abandono por etapa.
 * - Nenhum evento envia conteúdo das respostas (texto da alternativa) para
 *   serviços de anúncios, apenas eventos padronizados sem carga sensível.
 */

function pixelAllowed(): boolean {
  return getConsent() === "accepted";
}

export function trackPageView(): void {
  trackInternal("visitor");
}

export function trackViewContent(): void {
  if (pixelAllowed()) {
    fbqTrack("ViewContent", { content_name: "O Código do Silêncio - Oferta" });
  }
  trackInternal("offer_view");
}

export function trackQuizStart(): void {
  if (pixelAllowed()) {
    fbqTrackCustom("QuizStart");
  }
  trackInternal("quiz_start");
}

export function trackQuizQuestionReached(questionId: number): void {
  trackInternal("quiz_question_reached", questionId);
}

export function trackQuizAnswer(questionId: number): void {
  if (pixelAllowed()) {
    fbqTrackCustom("QuizAnswer", { question_id: questionId });
  }
}

export function trackQuizComplete(): void {
  if (pixelAllowed()) {
    fbqTrackCustom("QuizComplete");
  }
  trackInternal("quiz_complete");
}

export function trackInitiateCheckout(): string {
  const eventId = `checkout_${getOrCreateSessionId()}_${Date.now()}`;
  if (pixelAllowed()) {
    fbqTrack(
      "InitiateCheckout",
      { content_name: "O Código do Silêncio", currency: "BRL" },
      eventId,
    );
  }
  trackInternal("checkout_click");
  return eventId;
}
