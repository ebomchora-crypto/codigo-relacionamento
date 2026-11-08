import type { QuizQuestion } from "@/types/quiz";

/**
 * Banco de perguntas do quiz "O Código do Silêncio".
 *
 * Regras de pontuação (ver documentação completa em lib/scoring/engine.ts
 * e no README):
 * - kind "behavior": a alternativa escolhida soma 1 ponto para a dimensão
 *   associada. São as perguntas que realmente definem o perfil.
 * - kind "context": não pontua (dimension = null em todas as alternativas).
 *   Serve apenas para dar contexto à narrativa do quiz.
 * - kind "goal": não pontua para classificação emocional. É usada somente
 *   para personalizar a ênfase das recomendações exibidas no resultado.
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    kind: "context",
    weight: 0,
    title: "Como está a comunicação entre vocês atualmente?",
    options: [
      { id: "A", label: "Conversamos, mas sinto que algo mudou.", dimension: null },
      { id: "B", label: "A pessoa responde cada vez menos.", dimension: null },
      { id: "C", label: "Estamos sem conversar há dias.", dimension: null },
      { id: "D", label: "Terminamos, mas ainda existe contato.", dimension: null },
    ],
  },
  {
    id: 2,
    kind: "behavior",
    weight: 1,
    title: "Quando a pessoa demora para responder, o que você costuma fazer?",
    options: [
      { id: "A", label: "Mando outra mensagem.", dimension: "anxiety" },
      { id: "B", label: "Fico ansioso(a), mas espero.", dimension: "anxiety" },
      { id: "C", label: "Tento descobrir o que aconteceu.", dimension: "communication" },
      { id: "D", label: "Sigo minha rotina normalmente.", dimension: "balanced" },
    ],
  },
  {
    id: 3,
    kind: "behavior",
    weight: 1,
    title: "Qual situação mais incomoda você?",
    options: [
      { id: "A", label: "Sentir que só eu procuro.", dimension: "limits" },
      { id: "B", label: "Não saber se ainda existe interesse.", dimension: "anxiety" },
      { id: "C", label: "Ter medo de parecer carente.", dimension: "communication" },
      { id: "D", label: "Não conseguir superar o afastamento.", dimension: "anxiety" },
    ],
  },
  {
    id: 4,
    kind: "behavior",
    weight: 1,
    title: "Quando você percebe um afastamento, qual é sua primeira reação?",
    options: [
      { id: "A", label: "Tento conversar imediatamente.", dimension: "anxiety" },
      { id: "B", label: "Dou espaço, mas fico preocupado(a).", dimension: "limits" },
      { id: "C", label: "Finjo que não me importo.", dimension: "communication" },
      { id: "D", label: "Não sei como agir.", dimension: "communication" },
    ],
  },
  {
    id: 5,
    kind: "goal",
    weight: 0,
    title: "O que você mais gostaria de melhorar?",
    options: [
      { id: "A", label: "Minha segurança emocional.", dimension: null },
      { id: "B", label: "Minha forma de conversar.", dimension: null },
      { id: "C", label: "Minha reação ao silêncio.", dimension: null },
      { id: "D", label: "Minha capacidade de estabelecer limites.", dimension: null },
    ],
  },
  {
    id: 6,
    kind: "behavior",
    weight: 1,
    title: "Como você avalia sua comunicação atualmente?",
    options: [
      { id: "A", label: "Muito impulsiva.", dimension: "anxiety" },
      { id: "B", label: "Um pouco insegura.", dimension: "communication" },
      { id: "C", label: "Equilibrada na maioria das vezes.", dimension: "balanced" },
      { id: "D", label: "Tenho dificuldade de expressar o que sinto.", dimension: "communication" },
    ],
  },
  {
    id: 7,
    kind: "behavior",
    weight: 1,
    title: "O que você costuma fazer após uma conversa difícil?",
    options: [
      { id: "A", label: "Envio mensagens explicando tudo.", dimension: "anxiety" },
      { id: "B", label: "Espero a outra pessoa me procurar.", dimension: "limits" },
      { id: "C", label: "Releio a conversa várias vezes.", dimension: "anxiety" },
      { id: "D", label: "Procuro me acalmar antes de agir.", dimension: "balanced" },
    ],
  },
  {
    id: 8,
    kind: "goal",
    weight: 0,
    title: "Qual seria o resultado mais importante para você?",
    options: [
      { id: "A", label: "Voltar a conversar com tranquilidade.", dimension: null },
      { id: "B", label: "Entender se existe reciprocidade.", dimension: null },
      { id: "C", label: "Parar de sofrer com a incerteza.", dimension: null },
      { id: "D", label: "Me posicionar com mais confiança.", dimension: null },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
