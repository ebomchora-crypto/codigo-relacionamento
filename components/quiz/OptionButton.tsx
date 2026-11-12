"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Alternativa: CSS puro (transform/opacity), alvo de toque grande. */
export default function OptionButton({
  label,
  emoji,
  selected,
  dimmed,
  disabled,
  delay,
  onSelect,
}: {
  label: string;
  emoji?: string;
  selected: boolean;
  dimmed: boolean;
  disabled?: boolean;
  delay: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "focus-ring relative flex min-h-[3.5rem] w-full animate-opt-in items-center gap-3.5 rounded-2xl border px-4 py-2.5 text-left",
        "border-white/10 bg-white/[0.04] transition-[transform,opacity,border-color,background-color] duration-150",
        "active:scale-[0.97]",
        selected && "scale-[1.02] border-gold bg-gold/[0.14]",
        dimmed && "opacity-40",
      )}
    >
      <span aria-hidden className={cn("w-8 shrink-0 text-center text-[1.6rem] leading-none", selected && "animate-pop")}>
        {emoji}
      </span>
      <span className="flex-1 text-[1.02rem] font-medium leading-snug text-paper">{label}</span>
      <span
        aria-hidden
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
          selected ? "border-transparent bg-gold-fade text-ink" : "border-white/15",
        )}
      >
        {selected && (
          <span className="animate-pop">
            <Check size={15} strokeWidth={3.5} />
          </span>
        )}
      </span>
    </button>
  );
}
