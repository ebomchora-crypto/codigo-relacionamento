/**
 * Configuração central do produto. Todos os valores vêm de variáveis de
 * ambiente públicas, para que preço, checkout e nome possam ser alterados
 * sem tocar no código. Veja .env.example.
 */
export const PRODUCT_NAME =
  process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "O Código do Silêncio";

export const PRODUCT_SUBTITLE =
  "Como Reativar o Interesse Sem Parecer Carente";

export const KIWIFY_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL ?? "https://pay.kiwify.com.br/gPJXKem";

export const PRICE = Number(process.env.NEXT_PUBLIC_PRICE ?? "29.90");

export const PRICE_COMPARE = process.env.NEXT_PUBLIC_PRICE_COMPARE
  ? Number(process.env.NEXT_PUBLIC_PRICE_COMPARE)
  : null;

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codigo-do-silencio.vercel.app";

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
