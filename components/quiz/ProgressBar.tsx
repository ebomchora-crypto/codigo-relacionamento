"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Progresso: pergunta ${value} de ${max}`}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
    >
      <motion.div
        className="h-full rounded-full bg-gold-fade"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </div>
  );
}
