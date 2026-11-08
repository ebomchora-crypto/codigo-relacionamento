import type { ResultProfile } from "@/types/quiz";

export const RESULT_PROFILES: Record<string, ResultProfile> = {
  anxiety: {
    id: "anxiety",
    image: { src: "/images/waiting-bed.jpg", position: "40% 40%" },
    label: "Perfil A",
    title: "O silêncio pode estar ocupando espaço demais nos seus pensamentos.",
    body:
      "Suas respostas sugerem que momentos de incerteza podem despertar preocupação e vontade de encontrar respostas imediatamente. O primeiro passo é aprender a lidar com essa sensação sem permitir que ela determine todas as suas atitudes.",
    recommendations: [
      "Evite tomar decisões importantes no auge da preocupação.",
      "Observe padrões de reciprocidade ao longo do tempo.",
      "Aprenda a expressar suas necessidades sem cobranças impulsivas.",
    ],
  },
  limits: {
    id: "limits",
    image: { src: "/images/couple-talking.jpg", position: "50% 35%", tint: true },
    label: "Perfil B",
    title: "Você pode estar colocando a conexão acima das próprias necessidades.",
    body:
      "Suas respostas sugerem que manter a proximidade pode ser uma prioridade, mesmo quando você não sente a mesma reciprocidade. Aprender a estabelecer limites pode ajudar você a construir relações mais equilibradas.",
    recommendations: [
      "Identifique em quais momentos você abre mão do que sente para evitar conflito.",
      "Pratique comunicar um limite de forma calma, sem justificativas excessivas.",
      "Observe se o esforço na relação está sendo correspondido com o tempo.",
    ],
  },
  communication: {
    id: "communication",
    image: { src: "/images/hands-typing.jpg", position: "65% 50%", tint: true },
    label: "Perfil C",
    title: "Talvez você saiba o que sente, mas tenha dificuldade de expressar isso.",
    body:
      "Suas respostas sugerem dúvidas sobre quando conversar, o que dizer e como demonstrar sentimentos. Desenvolver comunicação assertiva pode ajudar você a agir com mais segurança.",
    recommendations: [
      "Escreva o que você sente antes de conversar, para organizar as ideias.",
      "Troque frases acusatórias por frases que descrevem o que você sente.",
      "Escolha momentos calmos para abordar assuntos sensíveis.",
    ],
  },
  balanced: {
    id: "balanced",
    image: { src: "/images/phone-candle.jpg", position: "78% 50%" },
    label: "Perfil D",
    title: "Você já demonstra atitudes importantes para uma comunicação saudável.",
    body:
      "Algumas respostas indicam que você consegue lidar com certas situações de maneira equilibrada. Ainda assim, compreender seus limites, suas expectativas e a reciprocidade pode ajudar você a tomar decisões mais conscientes.",
    recommendations: [
      "Continue observando se a reciprocidade acompanha o seu esforço.",
      "Reforce os limites que já funcionam para você em momentos de tensão.",
      "Use sua estabilidade atual para conversar sobre expectativas com mais clareza.",
    ],
  },
};

/**
 * Perfil neutro. Reutiliza o Perfil D (equilíbrio): é o resultado
 * devolvido pelo motor de pontuação (lib/scoring/engine.ts) sempre que
 * nenhuma dimensão de dificuldade supera "balanced", já que seu texto não
 * atribui nenhum problema específico ao leitor.
 */
export const NEUTRAL_PROFILE_ID = "balanced";
