"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import { FAQ_ITEMS } from "@/data/faq";
import { cn } from "@/lib/utils";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-ink-soft py-16 sm:py-20">
      <Container>
        <h2 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Perguntas frequentes
        </h2>

        <div className="mt-8 flex flex-col divide-y divide-white/10 border-y border-white/10">
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  className="focus-ring flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="flex-1 text-sm font-medium text-paper sm:text-base">
                    {item.question}
                  </span>
                  <Plus
                    size={18}
                    className={cn("shrink-0 text-gold transition-transform", open && "rotate-45")}
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
                      <p className="pb-5 text-sm leading-relaxed text-mist sm:text-base">
                        {item.answer}
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
