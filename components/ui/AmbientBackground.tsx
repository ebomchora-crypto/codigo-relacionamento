import { cn } from "@/lib/utils";

/**
 * Fundo vivo: duas luzes douradas em gradiente radial (mais barato que blur
 * em mobile) que derivam lentamente. Só transform é animado.
 */
export default function AmbientBackground({
  position = "top",
  className,
}: {
  position?: "top" | "center";
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className={cn(
          "absolute left-1/2 h-[120vw] w-[120vw] max-h-[42rem] max-w-[42rem] -translate-x-1/2",
          position === "top" ? "-top-[45%] sm:-top-1/3" : "top-1/2 -translate-y-1/2",
        )}
      >
        <div
          className="h-full w-full animate-drift rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(198,161,91,0.16), rgba(198,161,91,0.05) 55%, transparent)",
          }}
        />
      </div>
      <div className="absolute -bottom-[25%] -right-[30%] h-[90vw] w-[90vw] max-h-[34rem] max-w-[34rem]">
        <div
          className="h-full w-full animate-drift-reverse rounded-full"
          style={{
            background: "radial-gradient(closest-side, rgba(228,201,144,0.08), transparent)",
          }}
        />
      </div>
    </div>
  );
}
