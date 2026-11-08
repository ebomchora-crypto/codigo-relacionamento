import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PhotoSpec {
  src: string;
  position?: string;
  /** Aplica tom dourado/sépia, útil para fotos em preto e branco. */
  tint?: boolean;
}

type Fade = "bottom" | "top" | "both" | "none";

const masks: Record<Fade, string | undefined> = {
  bottom: "linear-gradient(to bottom, #000 25%, transparent)",
  top: "linear-gradient(to top, #000 25%, transparent)",
  both: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
  none: undefined,
};

/** Foto decorativa de fundo, escurecida e com fade para se fundir ao tema. */
export default function PhotoBackdrop({
  photo,
  fade = "bottom",
  opacity = 0.5,
  priority = false,
  sizes = "100vw",
  className,
}: {
  photo: PhotoSpec;
  fade?: Fade;
  opacity?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const mask = masks[fade];
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      <Image
        src={photo.src}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        quality={60}
        className="object-cover"
        style={{
          objectPosition: photo.position ?? "center",
          opacity,
          filter: photo.tint ? "sepia(0.55) saturate(1.3) brightness(0.85)" : undefined,
        }}
      />
      <div className="absolute inset-0 bg-ink/25" />
    </div>
  );
}
