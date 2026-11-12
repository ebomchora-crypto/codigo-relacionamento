import type { ResultProfile } from "@/types/quiz";

/** Textos curtos de propósito: nome grande, uma frase, três ações. */
export const RESULT_PROFILES: Record<string, ResultProfile> = {
  anxiety: {
    id: "anxiety",
    name: "Modo Alerta",
    line: "O silêncio ocupa a sua cabeça por inteiro.",
    example: "Vi que o dia tá corrido. Quando puder, me conta como você está.",
    costs: ["Reler a conversa mil vezes.", "Mandar a 2ª mensagem e se arrepender.", "Perder o sono esperando um “online”."],
    tips: [
      "Não envie nada no pico da ansiedade.",
      "Troque cobrança por uma frase calma.",
      "Olhe o esforço da pessoa ao longo do tempo.",
    ],
  },
  limits: {
    id: "limits",
    name: "Quem Dá Mais",
    line: "Você corre atrás mais do que recebe.",
    example: "Gosto de você e preciso entender se estamos na mesma página. Podemos conversar sobre isso?",
    costs: ["Dar mais do que recebe.", "Aceitar migalhas de atenção.", "Se esforçar sozinho(a) pela relação."],
    tips: [
      "Note onde você cede só para evitar conflito.",
      "Diga um limite sem se justificar.",
      "Compare o seu esforço com o da outra pessoa.",
    ],
  },
  communication: {
    id: "communication",
    name: "Rascunho Eterno",
    line: "Você sente muito, mas diz pouco.",
    example: "A gente ficou uns dias sem conversar e eu fiquei meio inseguro. Podemos nos falar hoje à noite?",
    costs: ["Escrever e apagar tudo.", "Dizer “tô bem” sem estar.", "Deixar o mais importante sem dizer."],
    tips: [
      "Escreva o que sente antes de conversar.",
      "Troque acusação por “eu sinto…”.",
      "Escolha um momento calmo para falar.",
    ],
  },
  balanced: {
    id: "balanced",
    name: "Calma Ativa",
    line: "Você mantém a calma. Falta blindá-la.",
    example: "Percebi que o papo ficou curto ultimamente. Está tudo bem por aí?",
    costs: ["Ignorar sinais por confiar demais.", "Deixar expectativas sem alinhar.", "Ceder em silêncio quando importa."],
    tips: [
      "Continue observando se o esforço é recíproco.",
      "Reforce os limites que já funcionam.",
      "Use sua estabilidade para alinhar expectativas.",
    ],
  },
};

export const DIMENSION_LABELS: Record<string, string> = {
  anxiety: "Ansiedade",
  limits: "Limites",
  communication: "Comunicação",
  balanced: "Equilíbrio",
};

/** Perfil neutro: devolvido pelo motor quando "balanced" lidera sozinho. */
export const NEUTRAL_PROFILE_ID = "balanced";
