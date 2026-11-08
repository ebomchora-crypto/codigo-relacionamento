import { promises as fs } from "fs";
import path from "path";
import os from "os";

/**
 * Armazenamento de métricas do funil.
 *
 * IMPORTANTE — leia antes de confiar nestes números em produção:
 * Esta implementação grava eventos em um arquivo JSON local (em
 * `os.tmpdir()`), pensada para desenvolvimento local e para demonstrar a
 * arquitetura do painel administrativo. Em uma função serverless da Vercel
 * o sistema de arquivos é efêmero e pode ser reiniciado a qualquer momento
 * entre instâncias, então os números podem ser parciais ou zerar em
 * produção.
 *
 * Para um ambiente de produção real, substitua as duas funções abaixo
 * (`appendEvent` e `readEvents`) por uma implementação equivalente usando
 * um banco de dados persistente (por exemplo Vercel KV/Redis, Postgres ou
 * Supabase). Nenhum outro arquivo do projeto precisa mudar — o painel em
 * app/admin consome apenas `getMetricsSnapshot()`.
 *
 * Nunca são armazenadas respostas pessoais identificáveis do quiz — apenas
 * contadores agregados, o id da pergunta e parâmetros de campanha (UTM).
 */

export type TrackedEventType =
  | "visitor"
  | "quiz_start"
  | "quiz_question_reached"
  | "quiz_complete"
  | "offer_view"
  | "checkout_click"
  | "purchase_confirmed";

export interface TrackedEvent {
  type: TrackedEventType;
  sessionId: string;
  questionId?: number;
  utmCampaign?: string;
  timestamp: number;
}

const DATA_FILE = path.join(os.tmpdir(), "ocds-metrics.ndjson");

async function appendEvent(event: TrackedEvent): Promise<void> {
  const line = JSON.stringify(event) + "\n";
  await fs.appendFile(DATA_FILE, line, "utf8");
}

async function readEvents(): Promise<TrackedEvent[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as TrackedEvent;
        } catch {
          return null;
        }
      })
      .filter((e): e is TrackedEvent => e !== null);
  } catch {
    return [];
  }
}

export async function recordEvent(event: Omit<TrackedEvent, "timestamp">): Promise<void> {
  await appendEvent({ ...event, timestamp: Date.now() });
}

export interface MetricsSnapshot {
  hasData: boolean;
  visitors: number;
  quizStarts: number;
  quizCompletions: number;
  completionRate: number | null;
  offerViews: number;
  checkoutClicks: number;
  purchasesConfirmed: number;
  dropoffByQuestion: { questionId: number; sessionsReached: number; dropped: number }[];
  byCampaign: { campaign: string; visitors: number; checkoutClicks: number; purchases: number }[];
}

export async function getMetricsSnapshot(): Promise<MetricsSnapshot> {
  const events = await readEvents();

  if (events.length === 0) {
    return {
      hasData: false,
      visitors: 0,
      quizStarts: 0,
      quizCompletions: 0,
      completionRate: null,
      offerViews: 0,
      checkoutClicks: 0,
      purchasesConfirmed: 0,
      dropoffByQuestion: [],
      byCampaign: [],
    };
  }

  const uniqueSessions = (type: TrackedEventType) =>
    new Set(events.filter((e) => e.type === type).map((e) => e.sessionId)).size;

  const visitors = uniqueSessions("visitor");
  const quizStarts = uniqueSessions("quiz_start");
  const quizCompletions = uniqueSessions("quiz_complete");
  const offerViews = uniqueSessions("offer_view");
  const checkoutClicks = events.filter((e) => e.type === "checkout_click").length;
  const purchasesConfirmed = uniqueSessions("purchase_confirmed");

  const reachedEvents = events.filter((e) => e.type === "quiz_question_reached" && e.questionId);
  const sessionsByQuestion = new Map<number, Set<string>>();
  for (const e of reachedEvents) {
    const qId = e.questionId as number;
    if (!sessionsByQuestion.has(qId)) sessionsByQuestion.set(qId, new Set());
    sessionsByQuestion.get(qId)!.add(e.sessionId);
  }

  const questionIds = Array.from(sessionsByQuestion.keys()).sort((a, b) => a - b);
  const dropoffByQuestion = questionIds.map((qId, index) => {
    const reached = sessionsByQuestion.get(qId)!.size;
    const nextReached = index + 1 < questionIds.length ? sessionsByQuestion.get(questionIds[index + 1])!.size : reached;
    return {
      questionId: qId,
      sessionsReached: reached,
      dropped: Math.max(0, reached - nextReached),
    };
  });

  const campaignSet = new Set(
    events.map((e) => e.utmCampaign).filter((c): c is string => Boolean(c)),
  );
  const byCampaign = Array.from(campaignSet).map((campaign) => ({
    campaign,
    visitors: new Set(
      events.filter((e) => e.type === "visitor" && e.utmCampaign === campaign).map((e) => e.sessionId),
    ).size,
    checkoutClicks: events.filter((e) => e.type === "checkout_click" && e.utmCampaign === campaign).length,
    purchases: new Set(
      events
        .filter((e) => e.type === "purchase_confirmed" && e.utmCampaign === campaign)
        .map((e) => e.sessionId),
    ).size,
  }));

  return {
    hasData: true,
    visitors,
    quizStarts,
    quizCompletions,
    completionRate: quizStarts > 0 ? quizCompletions / quizStarts : null,
    offerViews,
    checkoutClicks,
    purchasesConfirmed,
    dropoffByQuestion,
    byCampaign,
  };
}
