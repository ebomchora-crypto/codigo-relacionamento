import type { QuizQuestion } from "@/types/quiz";

/**
 * Quiz "O Código do Silêncio" — 5 perguntas, todas pontuáveis (peso 1).
 *
 * Cada alternativa soma 1 ponto para uma dimensão (anxiety | limits |
 * communication | balanced). Em cada pergunta as 4 alternativas cobrem as 4
 * dimensões, uma vez cada, em ordem variada — assim nenhuma posição é
 * "a resposta certa" e o perfil sai do conjunto das respostas.
 *
 * Perguntas escritas como cenas concretas (o que a pessoa REALMENTE faz),
 * para gerar identificação imediata e respostas honestas.
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    kind: "behavior",
    weight: 1,
    title: "Passaram 2 horas sem resposta. Você…",
    options: [
      { id: "A", emoji: "📲", label: "Mando outra mensagem", dimension: "anxiety" },
      { id: "B", emoji: "✍️", label: "Escrevo, apago, escrevo de novo", dimension: "communication" },
      { id: "C", emoji: "⏳", label: "Espero, mesmo me corroendo", dimension: "limits" },
      { id: "D", emoji: "😌", label: "Sigo meu dia numa boa", dimension: "balanced" },
    ],
  },
  {
    id: 2,
    kind: "behavior",
    weight: 1,
    title: "Qual pensamento mais aparece na sua cabeça?",
    options: [
      { id: "A", emoji: "💔", label: "“Só eu me esforço aqui.”", dimension: "limits" },
      { id: "B", emoji: "🤔", label: "“Será que eu falei demais?”", dimension: "anxiety" },
      { id: "C", emoji: "🙂", label: "“Se a pessoa quiser, ela aparece.”", dimension: "balanced" },
      { id: "D", emoji: "🤐", label: "“Não sei o que dizer.”", dimension: "communication" },
    ],
  },
  {
    id: 3,
    kind: "behavior",
    weight: 1,
    title: "De madrugada, celular na mão. Você…",
    options: [
      { id: "A", emoji: "💭", label: "Imagino tudo que devia ter dito", dimension: "communication" },
      { id: "B", emoji: "🔁", label: "Releio a conversa procurando o erro", dimension: "anxiety" },
      { id: "C", emoji: "😴", label: "Largo o celular e durmo", dimension: "balanced" },
      { id: "D", emoji: "🏃", label: "Planejo como me aproximar de novo", dimension: "limits" },
    ],
  },
  {
    id: 4,
    kind: "behavior",
    weight: 1,
    title: "O interesse esfriou. Sua reação é…",
    options: [
      { id: "A", emoji: "🎁", label: "Me esforçar mais pra compensar", dimension: "limits" },
      { id: "B", emoji: "🧘", label: "Observar e conversar com calma", dimension: "balanced" },
      { id: "C", emoji: "🔥", label: "Cobrar uma resposta na hora", dimension: "anxiety" },
      { id: "D", emoji: "🎭", label: "Fingir que não ligo", dimension: "communication" },
    ],
  },
  {
    id: 5,
    kind: "behavior",
    weight: 1,
    title: "O que você mais quer agora?",
    options: [
      { id: "A", emoji: "🧠", label: "Parar de pensar nisso o tempo todo", dimension: "anxiety" },
      { id: "B", emoji: "💬", label: "Saber exatamente o que dizer", dimension: "communication" },
      { id: "C", emoji: "🌿", label: "Manter minha paz, aconteça o que acontecer", dimension: "balanced" },
      { id: "D", emoji: "⚖️", label: "Ser correspondido(a) na mesma medida", dimension: "limits" },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
