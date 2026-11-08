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
        "focus-ring group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200",
        "border-white/10 bg-ink-soft hover:border-gold/40 hover:bg-white/[0.03]",
        selected && "border-gold bg-gold/10 shadow-gold",
        disabled && !selected && "opacity-40",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
          selected
            ? "border-gold bg-gold text-ink"
            : "border-white/15 text-mist group-hover:border-gold/50 group-hover:text-gold-soft",
        )}
      >
        {selected ? <Check size={16} strokeWidth={3} /> : letter}
      </span>
      <span className="text-[0.95rem] leading-snug text-paper sm:text-base">{label}</span>
    </button>
  );
}
