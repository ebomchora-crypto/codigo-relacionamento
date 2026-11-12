"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Reveal à prova de falha: o conteúdo SEMPRE nasce visível (SSR, sem JS ou
 * IntersectionObserver quebrado = nada some). Só depois de montar, os itens
 * que estão abaixo da tela são escondidos e revelados quando entram. Se o
 * navegador não suportar IntersectionObserver, nada é escondido.
 */
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
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
      { rootMargin: "0px 0px -6% 0px" },
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
    const io = getObserver();
    if (!el || !io) return;
    const rect = el.getBoundingClientRect();
    // Já está na tela: não esconde, não pisca.
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    el.classList.add("rv");
    io.observe(el);
    // Rede de segurança: nunca deixa algo escondido por mais de 4s depois de aparecer.
    const t = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add("in");
    }, 4000);
    return () => {
      window.clearTimeout(t);
      io.unobserve(el);
    };
  }, []);

  const Comp = as as "div";
  const style = { "--rv-y": `${y}px`, "--rv-d": `${delay}s` } as CSSProperties;
  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>
      {children}
    </Comp>
  );
}
