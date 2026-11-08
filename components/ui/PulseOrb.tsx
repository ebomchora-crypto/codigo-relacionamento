"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function PulseOrb({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={`relative flex h-16 w-16 items-center justify-center ${className ?? ""}`}>
      {!reduce &&
        [0, 0.9, 1.8].map((delay) => (
          <motion.span
            key={delay}
            className="absolute inset-0 rounded-full border border-gold/50"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 2.7, repeat: Infinity, delay, ease: "easeOut" }}
          />
        ))}
      <span className="h-3 w-3 rounded-full bg-gold-fade shadow-gold" />
    </div>
  );
}
