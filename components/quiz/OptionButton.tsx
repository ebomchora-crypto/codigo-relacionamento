"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      whileTap={disabled ? undefined : { scale: 0.975 }}
      animate={
        selected
          ? { scale: 1.015 }
          : disabled
            ? { scale: 0.98, opacity: 0.35, filter: "blur(1px)" }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
      }
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(
        "focus-ring group relative flex min-h-[3.75rem] w-full items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3.5 text-left sm:px-5",
        "border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-[2px]",
        "transition-[border-color,background-color,box-shadow] duration-200",
        "hover:border-gold/40 hover:shadow-[0_12px_30px_-16px_rgba(198,161,91,0.35)]",
        selected && "border-gold/70 bg-gold/[0.09] shadow-gold",
        disabled && !selected && "pointer-events-none",
      )}
    >
      {selected && (
        <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-9 w-9 -translate-y-1/2 sm:left-5">
          <motion.span
            className="block h-full w-full rounded-full bg-gold/60"
            initial={{ scale: 0.3, opacity: 0.7 }}
            animate={{ scale: 9, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </span>
      )}

      <span
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-display text-sm font-semibold transition-colors duration-200",
          selected
            ? "border-transparent bg-gold-fade text-ink"
            : "border-white/15 bg-white/[0.02] text-mist group-hover:border-gold/50 group-hover:text-gold-soft",
        )}
      >
        {selected ? (
          <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
            <Check size={16} strokeWidth={3} />
          </motion.span>
        ) : (
          letter
        )}
      </span>
      <span className="relative text-[0.98rem] leading-snug text-paper sm:text-base">{label}</span>
    </motion.button>
  );
}
