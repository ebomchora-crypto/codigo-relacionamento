import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { PRODUCT_NAME, PRODUCT_SUBTITLE, SITE_URL } from "@/data/product";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${PRODUCT_NAME} — ${PRODUCT_SUBTITLE}`,
  description:
    "Responda 5 perguntas e descubra qual é o seu padrão quando a pessoa visualiza e some.",
  openGraph: {
    title: PRODUCT_NAME,
    description: PRODUCT_SUBTITLE,
    url: SITE_URL,
    siteName: PRODUCT_NAME,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT_NAME,
    description: PRODUCT_SUBTITLE,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#09090B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-ink font-body text-paper">{children}</body>
    </html>
  );
}
