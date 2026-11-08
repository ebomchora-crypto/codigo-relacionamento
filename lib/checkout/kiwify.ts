import { KIWIFY_CHECKOUT_URL } from "@/data/product";

/**
 * Monta a URL final do checkout da Kiwify, preservando os parâmetros UTM
 * capturados na chegada do visitante (quando o checkout aceita query
 * params — a Kiwify repassa esses parâmetros para fins de atribuição em
 * suas próprias integrações).
 */
export function buildCheckoutUrl(utm: Record<string, string>): string {
  try {
    const url = new URL(KIWIFY_CHECKOUT_URL);
    for (const [key, value] of Object.entries(utm)) {
      if (value) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return KIWIFY_CHECKOUT_URL;
  }
}
