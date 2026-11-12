import { Lock, Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

/** Linha do tempo do plano de 7 dias do guia: 3 primeiros dias abertos, o resto dentro do guia. */
const DAYS = [
  "Salve a nota “PARE” e defina seu intervalo entre mensagens.",
  "Tire as notificações e escolha 2 horários para checar mensagens.",
  "Anote os 4 sinais do afastamento. Só fatos.",
  "Responda as perguntas de reciprocidade.",
  "Escreva a mensagem que você realmente quer enviar.",
  "Releia, ajuste e decida se envia.",
  "Reveja a semana e escolha o próximo passo.",
];

export default function PlanPreview() {
  return (
    <section className="bg-ink py-12">
      <Container>
        <Reveal>
          <h2 className="font-display text-2xl font-semibold leading-tight text-paper">Seu plano de 7 dias</h2>
          <p className="mt-2 text-sm text-mist">Um passo por dia, poucos minutos cada.</p>
        </Reveal>
        <ol className="mt-6 flex flex-col">
          {DAYS.map((text, i) => {
            const open = i < 3;
            return (
              <Reveal as="li" key={text} delay={i * 0.05} y={12}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold " +
                        (open ? "border-transparent bg-gold-fade text-ink" : "border-white/15 bg-white/[0.04] text-mist")
                      }
                    >
                      {open ? <Check size={16} strokeWidth={3} /> : <Lock size={14} />}
                    </span>
                    {i < DAYS.length - 1 && <span className="my-1 w-px flex-1 bg-white/10" />}
                  </div>
                  <div className="pb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold">Dia {i + 1}</p>
                    <p
                      className={open ? "mt-0.5 text-[1rem] leading-snug text-paper" : "mt-0.5 select-none text-[1rem] leading-snug text-transparent"}
                      style={open ? undefined : { textShadow: "0 0 8px rgba(247,244,239,0.7)" }}
                    >
                      {text}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
