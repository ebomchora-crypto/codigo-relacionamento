"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import { PRODUCT_MODULES } from "@/data/modules";
import { cn } from "@/lib/utils";

/** Acordeão em CSS (grid-rows 0fr→1fr): sem medir altura em JS. */
export default function ModulesList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-ink py-14">
      <Container>
        <Reveal>
          <h2 className="font-display text-2xl font-semibold leading-tight text-paper">
            O que tem dentro
          </h2>
        </Reveal>

        <div className="mt-6 flex flex-col divide-y divide-white/10 border-y border-white/10">
          {PRODUCT_MODULES.map((module, index) => {
            const open = openIndex === index;
            return (
              <div key={module.number}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  className="focus-ring flex min-h-14 w-full items-center gap-4 py-4 text-left"
                >
                  <span className="font-display text-sm text-gold">{module.number}</span>
                  <span className="flex-1 font-display text-base font-medium text-paper">{module.title}</span>
                  <ChevronDown
                    size={18}
                    className={cn("shrink-0 text-mist transition-transform duration-200", open && "rotate-180 text-gold")}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pl-9 text-sm leading-relaxed text-mist">{module.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
