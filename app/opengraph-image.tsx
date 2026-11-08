import { ImageResponse } from "next/og";
import { PRODUCT_NAME, PRODUCT_SUBTITLE } from "@/data/product";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090B",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(198,161,91,0.18), transparent 60%)",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            color: "#C6A15B",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
          }}
        >
          Análise de Comunicação Afetiva
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            fontWeight: 700,
            color: "#F7F4EF",
            textAlign: "center",
            fontFamily: "serif",
          }}
        >
          {PRODUCT_NAME}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "#A1A1AA",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          {PRODUCT_SUBTITLE}
        </div>
      </div>
    ),
    { ...size },
  );
}
