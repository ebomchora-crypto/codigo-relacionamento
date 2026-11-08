import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/analytics/store";
import { META_PIXEL_ID, PRICE } from "@/data/product";

/**
 * Webhook da Kiwify — única fonte confiável para o evento Purchase.
 *
 * Configuração necessária no painel da Kiwify (Webhooks):
 * URL: https://SEU-DOMINIO/api/webhooks/kiwify?token=SEU_TOKEN
 * O token deve ser o mesmo valor definido em KIWIFY_WEBHOOK_TOKEN (.env).
 *
 * Este endpoint nunca confia em um "retorno" do navegador (página de
 * agradecimento) para disparar Purchase — apenas nesta notificação
 * servidor-a-servidor, validada pelo token, é que o evento é confirmado.
 * Isso evita duplicidade e falsos positivos.
 */

interface KiwifyWebhookPayload {
  order_id?: string;
  order_status?: string;
  Customer?: { email?: string; full_name?: string };
  Product?: { product_name?: string };
  Commissions?: { charge_amount?: number };
  [key: string]: unknown;
}

const PAID_STATUSES = new Set(["paid", "approved"]);

export async function POST(request: NextRequest) {
  const expectedToken = process.env.KIWIFY_WEBHOOK_TOKEN;

  if (!expectedToken) {
    return NextResponse.json(
      { ok: false, error: "KIWIFY_WEBHOOK_TOKEN não configurado no ambiente." },
      { status: 500 },
    );
  }

  const providedToken = request.nextUrl.searchParams.get("token");
  if (providedToken !== expectedToken) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 401 });
  }

  let payload: KiwifyWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const status = (payload.order_status ?? "").toLowerCase();
  if (!PAID_STATUSES.has(status)) {
    // Notificação válida, mas não é uma confirmação de pagamento (ex.:
    // reembolso, recusa). Apenas confirmamos o recebimento.
    return NextResponse.json({ ok: true, ignored: true, status });
  }

  const orderId = payload.order_id ?? `kiwify_${Date.now()}`;

  await recordEvent({
    type: "purchase_confirmed",
    sessionId: `order_${orderId}`,
  });

  await forwardToMetaConversionsApi(payload, orderId);

  return NextResponse.json({ ok: true });
}

function hashField(value?: string): string | undefined {
  if (!value) return undefined;
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

async function forwardToMetaConversionsApi(payload: KiwifyWebhookPayload, orderId: string) {
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;
  if (!accessToken || !META_PIXEL_ID) return;

  try {
    const body = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: `purchase_${orderId}`,
          action_source: "website",
          user_data: {
            em: payload.Customer?.email ? [hashField(payload.Customer.email)] : undefined,
          },
          custom_data: {
            currency: "BRL",
            value: payload.Commissions?.charge_amount ?? PRICE,
            content_name: payload.Product?.product_name ?? "O Código do Silêncio",
          },
        },
      ],
      ...(process.env.META_CONVERSIONS_API_TEST_EVENT_CODE
        ? { test_event_code: process.env.META_CONVERSIONS_API_TEST_EVENT_CODE }
        : {}),
    };

    await fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Falha no envio para a CAPI não deve afetar a confirmação do webhook.
  }
}
