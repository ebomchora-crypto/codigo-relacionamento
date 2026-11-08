"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import { PRODUCT_MODULES } from "@/data/modules";
import { cn } from "@/lib/utils";

export default function ModulesList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-ink py-16 sm:py-20">
      <Container>
        <h2 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          O que você vai encontrar no guia?
        </h2>

        <div className="mt-8 flex flex-col divide-y divide-white/10 border-y border-white/10">
          {PRODUCT_MODULES.map((module, index) => {
            const open = openIndex === index;
            return (
              <div key={module.number}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  className="focus-ring flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="font-display text-sm text-gold">{module.number}</span>
                  <span className="flex-1 font-display text-base font-medium text-paper sm:text-lg">
                    {module.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn("shrink-0 text-mist transition-transform", open && "rotate-180 text-gold")}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pl-9 text-sm leading-relaxed text-mist sm:text-base">
                        {module.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
