import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Capa real do e-book (public/images/ebook-cover-hd.jpg), ampliada com
 * super-resolução (Real-ESRGAN 4x) a partir do arquivo original de 175x175 px;
 * as duas linhas do subtítulo foram redesenhadas para ficarem nítidas e corretas. Se tiver o
 * arquivo original em alta resolução, basta substituí-lo mantendo o nome.
 */
export default function EbookCoverArt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-xl border border-gold/25 shadow-gold",
        className,
      )}
    >
      <Image
        src="/images/ebook-cover-hd.jpg"
        alt="Capa do e-book O Código do Silêncio: um casal sentado de costas um para o outro, com um celular aceso sobre a mesa"
        fill
        sizes="(min-width: 640px) 320px, 80vw"
        quality={85}
        className="object-cover"
      />
    </div>
  );
}
