"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Progresso: pergunta ${value} de ${max}`}
      className="flex w-full gap-1.5"
    >
      {Array.from({ length: max }, (_, i) => {
        const done = i < value - 1;
        const current = i === value - 1;
        return (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.span
              className="block h-full rounded-full bg-gold-fade"
              style={current ? { boxShadow: "0 0 10px rgba(228,201,144,0.7)" } : undefined}
              initial={{ width: done ? "100%" : "0%" }}
              animate={{ width: done || current ? "100%" : "0%" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        );
      })}
    </div>
  );
}
