import { QUESTIONS } from "@/data/questions";
import type { AnsweredQuestion, Dimension, ScoreBreakdown } from "@/types/quiz";

/**
 * Motor de classificação do quiz.
 *
 * Como funciona:
 * 1. Cada pergunta do tipo "behavior" (perguntas 2, 3, 4, 6 e 7 — 5 no
 *    total) tem peso 1 e associa cada alternativa a uma dimensão
 *    (anxiety | limits | communication | balanced).
 * 2. A pergunta "context" (pergunta 1) e as perguntas "goal" (5 e 8) nunca
 *    pontuam — elas não entram nesta soma. Isso evita tratar toda resposta
 *    como sintoma e evita atribuir rótulos emocionais a partir de objetivos
 *    pessoais; as perguntas de objetivo servem apenas para personalizar a
 *    ênfase das recomendações exibidas no resultado.
 * 3. A dimensão com maior soma é a dimensão predominante (plural simples).
 *    Como há 5 perguntas pontuáveis distribuídas entre 4 dimensões, pelo
 *    princípio da casa dos pombos a dimensão líder tem sempre pontuação
 *    >= 2 — ou seja, sempre existe algum padrão com pelo menos duas
 *    respostas confirmando-o.
 *
 * Critério de desempate (quando duas ou mais dimensões empatam no topo):
 * - Se "balanced" empata com uma dimensão de dificuldade (anxiety, limits
 *   ou communication), a dimensão de dificuldade prevalece na escolha do
 *   resultado — ela é mais específica e acionável para o leitor do que o
 *   texto genérico do perfil equilibrado.
 * - Entre as dimensões de dificuldade, a ordem de prioridade documentada é
 *   anxiety > communication > limits. Essa ordem reflete apenas uma escolha
 *   de desempate determinística, não uma hierarquia de gravidade.
 *
 * Resultado neutro:
 * - O Perfil D (equilíbrio) é devolvido sempre que "balanced" é a única
 *   dimensão líder — isto é, quando nenhuma dimensão de dificuldade
 *   (anxiety, limits, communication) alcança ou supera a pontuação de
 *   "balanced". Como o texto desse perfil já não atribui nenhum problema
 *   específico ao leitor, ele funciona como o resultado neutro do quiz
 *   quando as respostas não indicam um padrão de dificuldade predominante.
 *
 * Este critério é determinístico e documentado para fins de transparência;
 * não representa uma avaliação psicológica validada.
 */

const TIEBREAK_ORDER: Dimension[] = ["anxiety", "communication", "limits", "balanced"];

export function computeScore(answers: AnsweredQuestion[]): ScoreBreakdown {
  const score: ScoreBreakdown = { anxiety: 0, limits: 0, communication: 0, balanced: 0 };

  for (const answer of answers) {
    const question = QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question || question.weight === 0) continue;

    const option = question.options.find((o) => o.id === answer.optionId);
    if (!option || !option.dimension) continue;

    score[option.dimension] += question.weight;
  }

  return score;
}

export function resolveProfile(score: ScoreBreakdown): Dimension {
  const maxValue = Math.max(score.anxiety, score.limits, score.communication, score.balanced);

  const leaders = TIEBREAK_ORDER.filter((dimension) => score[dimension] === maxValue);

  if (leaders.length === 1) {
    return leaders[0];
  }

  const nonBalancedLeaders = leaders.filter((dimension) => dimension !== "balanced");
  if (nonBalancedLeaders.length > 0) {
    return nonBalancedLeaders[0];
  }

  return "balanced";
}

export function classifyAnswers(answers: AnsweredQuestion[]): {
  score: ScoreBreakdown;
  profile: Dimension;
} {
  const score = computeScore(answers);
  const profile = resolveProfile(score);
  return { score, profile };
}
