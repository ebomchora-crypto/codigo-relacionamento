"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Reveal leve: um único IntersectionObserver compartilhado e animação só de
 * opacity/transform via CSS (sem JS por frame), para não travar em celulares
 * mais simples.
 */
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
  }
  return observer;
}

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
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  const Comp = as as "div";
  const style = { "--rv-y": `${y}px`, "--rv-d": `${delay}s` } as CSSProperties;
  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} className={`rv${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </Comp>
  );
}
