"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OptionButton({
  label,
  letter,
  selected,
  disabled,
  onSelect,
}: {
  label: string;
  letter: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "focus-ring group relative flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left",
        "transition-all duration-200 ease-out",
        "border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent",
        "hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_12px_30px_-16px_rgba(198,161,91,0.35)]",
        "active:translate-y-0",
        selected && "border-gold/70 bg-gold/[0.08] shadow-gold",
        disabled && !selected && "pointer-events-none opacity-35",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-display text-sm font-semibold transition-all duration-200",
          selected
            ? "border-transparent bg-gold-fade text-ink"
            : "border-white/15 bg-white/[0.02] text-mist group-hover:border-gold/50 group-hover:text-gold-soft",
        )}
      >
        {selected ? <Check size={16} strokeWidth={3} /> : letter}
      </span>
      <span className="text-[0.95rem] leading-snug text-paper sm:text-base">{label}</span>

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-1 rounded-r-2xl bg-gold-fade transition-opacity duration-200",
          selected ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
}
