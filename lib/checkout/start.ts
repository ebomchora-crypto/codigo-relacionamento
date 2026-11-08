import { buildCheckoutUrl } from "@/lib/checkout/kiwify";
import { captureUtmParams } from "@/lib/session";
import { trackInitiateCheckout } from "@/lib/analytics/events";

export function startCheckout(): void {
  trackInitiateCheckout();
  window.location.href = buildCheckoutUrl(captureUtmParams());
}
