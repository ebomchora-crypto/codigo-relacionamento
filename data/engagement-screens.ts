import type { EngagementScreen } from "@/types/quiz";

export const ENGAGEMENT_SCREENS: EngagementScreen[] = [
  {
    afterQuestionId: 3,
    image: { src: "/images/couple-talking.jpg", position: "50% 40%", tint: true },
    title: "Nem todo silêncio significa falta de interesse.",
    body:
      "Às vezes existe distância. Em outras situações, existem dificuldades de comunicação ou expectativas diferentes. Aprender a reconhecer esses sinais pode ajudar você a tomar decisões mais conscientes.",
    cta: "Continuar",
  },
  {
    afterQuestionId: 6,
    image: { src: "/images/hands-typing.jpg", position: "65% 50%", tint: true },
    title: "Você não precisa descobrir a mensagem perfeita.",
    body:
      "Uma comunicação saudável começa quando você consegue expressar o que sente sem abrir mão dos próprios limites.",
    cta: "Ver próximas perguntas",
  },
];
