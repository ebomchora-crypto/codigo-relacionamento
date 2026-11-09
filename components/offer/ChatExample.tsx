import { Check, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

/** Antes x depois em formato de conversa: o que o guia muda na prática. */
export default function ChatExample() {
  return (
    <section className="bg-ink py-12">
      <Container>
        <Reveal>
          <h2 className="font-display text-2xl font-semibold leading-tight text-paper">
            A mesma situação. Duas respostas.
          </h2>
          <p className="mt-2 text-sm text-mist">Exemplo ilustrativo de como o guia ensina a escrever.</p>
        </Reveal>

        <div className="mt-6 grid gap-4 min-[560px]:grid-cols-2">
          <Reveal y={16}>
            <div className="h-full rounded-2xl border border-red-400/25 bg-white/[0.03] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-red-300">
                <X size={16} strokeWidth={3} /> No impulso
              </p>
              <div className="mt-3 flex flex-col items-end gap-1.5">
                {["Oi?", "Vc viu minha mensagem??", "Tá me ignorando?"].map((m) => (
                  <span key={m} className="rounded-2xl rounded-br-md bg-[#3a1f22] px-3.5 py-2 text-[0.95rem] text-paper">
                    {m}
                  </span>
                ))}
                <span className="mt-1 text-[11px] text-mist">visualizado ✓✓</span>
              </div>
            </div>
          </Reveal>

          <Reveal y={16} delay={0.12}>
            <div className="h-full rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.05] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <Check size={16} strokeWidth={3} /> Com o método
              </p>
              <div className="mt-3 flex flex-col items-end gap-1.5">
                <span className="rounded-2xl rounded-br-md bg-[#1f3b2e] px-3.5 py-2 text-[0.95rem] leading-snug text-paper">
                  Vi que o dia tá corrido. Quando puder, me conta como você está. 🙂
                </span>
                <span className="mt-1 text-[11px] text-mist">uma mensagem. clara. calma.</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
