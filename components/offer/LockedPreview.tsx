import { Lock } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import type { ResultProfile } from "@/types/quiz";

/**
 * Prévia do guia: uma mensagem do seu padrão aberta e as outras de dentro do
 * guia desfocadas. O texto desfocado é conteúdo real do e-book (módulo 4).
 */
const LOCKED = [
  { when: "Respondeu seco", text: "Percebi que o papo ficou curto ultimamente. Está tudo bem por aí?" },
  { when: "Cancelou um encontro", text: "Tudo bem, acontece. Me diz quando fica bom para você e a gente remarca." },
  { when: "Depois de uma discussão", text: "Não gostei de como a gente terminou a conversa ontem. Vamos conversar com calma?" },
];

export default function LockedPreview({ profile }: { profile: ResultProfile }) {
  return (
    <section className="bg-ink-soft py-12">
      <Container>
        <Reveal>
          <h2 className="font-display text-2xl font-semibold leading-tight text-paper">
            Uma mensagem do guia, para o seu padrão
          </h2>
        </Reveal>

        <Reveal delay={0.08} y={14}>
          <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Liberada · {profile.name}</p>
            <p className="mt-2 rounded-2xl rounded-bl-md bg-[#1f3b2e] px-3.5 py-2.5 text-[1rem] italic leading-snug text-paper">
              “{profile.example}”
            </p>
          </div>
        </Reveal>

        <div className="mt-3 flex flex-col gap-3">
          {LOCKED.map((m, i) => (
            <Reveal key={m.when} delay={0.12 + i * 0.07} y={14}>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
                  <Lock size={13} /> {m.when}
                </p>
                <p
                  aria-hidden
                  className="mt-2 select-none text-[1rem] italic leading-snug text-transparent"
                  style={{ textShadow: "0 0 9px rgba(247,244,239,0.75)" }}
                >
                  “{m.text}”
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <p className="mt-4 text-sm text-mist">Mais mensagens para cada situação dentro do módulo 4.</p>
        </Reveal>
      </Container>
    </section>
  );
}
