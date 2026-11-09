import { cn } from "@/lib/utils";

/**
 * Fundo estático (gradientes radiais, sem blur e sem animação infinita):
 * custo zero de GPU em celulares simples.
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
        style={{
          background:
            "radial-gradient(closest-side, rgba(198,161,91,0.16), rgba(198,161,91,0.05) 55%, transparent)",
        }}
      />
    </div>
  );
}
