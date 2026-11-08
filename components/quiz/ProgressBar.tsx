"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const segments = Array.from({ length: max }, (_, i) => i < value);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Progresso: pergunta ${value} de ${max}`}
      className="flex w-full gap-1.5"
    >
      {segments.map((filled, i) => (
        <span
          key={i}
          className={cn(
            "h-1 flex-1 overflow-hidden rounded-full",
            filled ? "bg-white/10" : "bg-white/10",
          )}
        >
          <motion.span
            className="block h-full rounded-full bg-gold-fade"
            initial={{ width: filled ? "100%" : "0%" }}
            animate={{ width: filled ? "100%" : "0%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </span>
      ))}
    </div>
  );
}
