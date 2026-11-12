export type Dimension = "anxiety" | "limits" | "communication" | "balanced";

export type QuestionKind = "behavior";

export interface QuizOption {
  id: "A" | "B" | "C" | "D";
  /** Emoji que ajuda a bater o olho e reconhecer a alternativa. */
  emoji?: string;
  label: string;
  /**
   * Dimensão associada a esta alternativa. `null` quando a alternativa não
   * deve contar para a classificação (perguntas de contexto ou de objetivo).
   */
  dimension: Dimension | null;
}

export interface QuizQuestion {
  id: number;
  kind: QuestionKind;
  /** Peso aplicado à dimensão da alternativa escolhida nesta pergunta. */
  weight: number;
  title: string;
  options: QuizOption[];
}

export interface PhotoRef {
  src: string;
  position?: string;
  tint?: boolean;
}

export interface AnsweredQuestion {
  questionId: number;
  optionId: QuizOption["id"];
}

export interface ResultProfile {
  image?: PhotoRef;
  id: Dimension;
  /** Nome curto do padrão (aparece grande no resultado). */
  name: string;
  /** Uma frase que resume o padrão. */
  line: string;
  /** Uma mensagem de exemplo do guia, mostrada na prévia. */
  example: string;
  /** O que continua acontecendo se nada mudar (3 itens curtos). */
  costs: [string, string, string];
  /** Três ações curtas. */
  tips: [string, string, string];
}

export interface ScoreBreakdown {
  anxiety: number;
  limits: number;
  communication: number;
  balanced: number;
}
