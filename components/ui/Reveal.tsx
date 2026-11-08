"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  y = 20,
  as = "div",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section";
  className?: string;
}) {
  const Comp = as === "li" ? motion.li : as === "section" ? motion.section : motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
