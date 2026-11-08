export type Dimension = "anxiety" | "limits" | "communication" | "balanced";

export type QuestionKind = "behavior" | "context" | "goal";

export interface QuizOption {
  id: "A" | "B" | "C" | "D";
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

export interface EngagementScreen {
  image?: PhotoRef;
  afterQuestionId: number;
  title: string;
  body: string;
  cta: string;
}

export interface AnsweredQuestion {
  questionId: number;
  optionId: QuizOption["id"];
}

export interface ResultProfile {
  image?: PhotoRef;
  id: Dimension;
  label: string;
  title: string;
  body: string;
  recommendations: [string, string, string];
}

export interface ScoreBreakdown {
  anxiety: number;
  limits: number;
  communication: number;
  balanced: number;
}
