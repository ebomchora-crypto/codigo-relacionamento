import { cn } from "@/lib/utils";

/**
 * Mockup visual da capa do e-book, construído em SVG/CSS.
 *
 * Este NÃO é a capa final do produto — é uma composição placeholder de alta
 * qualidade para que a oferta já fique visualmente completa. Para usar a
 * capa real, veja as instruções no README ("Como adicionar a capa do
 * produto"): basta substituir este componente por uma <Image> apontando
 * para o arquivo em /public/ebook-cover.jpg.
 */
export default function EbookCoverArt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-xl border border-gold/25 shadow-gold",
        className,
      )}
      role="img"
      aria-label="Capa do e-book O Código do Silêncio"
    >
      <svg viewBox="0 0 300 400" className="h-full w-full">
        <defs>
          <linearGradient id="cover-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#141416" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>
          <linearGradient id="cover-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C6A15B" stopOpacity="0" />
            <stop offset="50%" stopColor="#E4C990" />
            <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#cover-bg)" />
        <rect x="14" y="14" width="272" height="372" fill="none" stroke="#C6A15B" strokeOpacity="0.35" />
        <circle cx="150" cy="150" r="46" fill="none" stroke="#C6A15B" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="150" cy="150" r="30" fill="none" stroke="#E4C990" strokeOpacity="0.6" strokeWidth="1" />
        <line x1="150" y1="104" x2="150" y2="196" stroke="#C6A15B" strokeOpacity="0.4" strokeWidth="1" />
        <rect x="70" y="238" width="160" height="1" fill="url(#cover-line)" />
        <text
          x="150"
          y="270"
          textAnchor="middle"
          fontFamily="Playfair Display, serif"
          fontSize="22"
          fontWeight="600"
          fill="#F7F4EF"
        >
          O Código do
        </text>
        <text
          x="150"
          y="298"
          textAnchor="middle"
          fontFamily="Playfair Display, serif"
          fontSize="22"
          fontWeight="600"
          fill="#E4C990"
        >
          Silêncio
        </text>
        <text
          x="150"
          y="326"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="9"
          letterSpacing="1.5"
          fill="#A1A1AA"
        >
          COMO REATIVAR O INTERESSE
        </text>
        <text
          x="150"
          y="340"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="9"
          letterSpacing="1.5"
          fill="#A1A1AA"
        >
          SEM PARECER CARENTE
        </text>
      </svg>
    </div>
  );
}
