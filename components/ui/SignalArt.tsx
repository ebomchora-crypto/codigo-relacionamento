"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Duas pessoas, uma mensagem que sai e um trecho de silêncio entre elas.
 * Tema do produto: comunicação e distância.
 */
export default function SignalArt({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const fade = `sa-fade-${uid}`;
  const fadeIn = `sa-fadein-${uid}`;
  const loop = { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <svg
      viewBox="0 0 320 140"
      className={className}
      role="img"
      aria-label="Duas pessoas ligadas por uma linha de comunicação, com um trecho de silêncio entre elas"
    >
      <defs>
        <linearGradient id={fade} gradientUnits="userSpaceOnUse" x1="70" x2="150" y1="0" y2="0">
          <stop offset="0" stopColor="#E4C990" stopOpacity="0.9" />
          <stop offset="1" stopColor="#C6A15B" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={fadeIn} gradientUnits="userSpaceOnUse" x1="172" x2="250" y1="0" y2="0">
          <stop offset="0" stopColor="#C6A15B" stopOpacity="0.05" />
          <stop offset="1" stopColor="#E4C990" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <path d="M70 70 H150" stroke={`url(#${fade})`} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M172 70 H250"
        stroke={`url(#${fadeIn})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 7"
      />

      <motion.circle
        cx="160"
        cy="70"
        r="2.5"
        fill="#C6A15B"
        animate={reduce ? undefined : { opacity: [0.2, 0.9, 0.2], r: [2, 3.2, 2] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {!reduce &&
        [0, 1.1].map((delay) => (
          <motion.circle
            key={delay}
            cx="60"
            cy="70"
            r="10"
            fill="none"
            stroke="#C6A15B"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0.55, 0], scale: [1, 3.4] }}
            transition={{ ...loop, delay, ease: "easeOut" }}
            style={{ transformOrigin: "60px 70px", transformBox: "fill-box" }}
          />
        ))}

      {!reduce && (
        <motion.circle
          cy="70"
          r="3"
          fill="#E4C990"
          initial={{ cx: 70, opacity: 0 }}
          animate={{ cx: [70, 150], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1, ease: "easeIn" }}
        />
      )}

      <circle cx="60" cy="70" r="10" fill="#C6A15B" />
      <circle cx="60" cy="70" r="4" fill="#09090B" />

      <motion.circle
        cx="260"
        cy="70"
        r="10"
        fill="#09090B"
        stroke="#E4C990"
        strokeWidth="1.5"
        animate={reduce ? undefined : { strokeOpacity: [0.35, 1, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="260" cy="70" r="3" fill="#E4C990" fillOpacity="0.8" />
    </svg>
  );
}
